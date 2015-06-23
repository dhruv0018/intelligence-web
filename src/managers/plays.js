import KrossoverEvent from '../entities/event.js';

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name PlaysManager
 * @type {service}
 */
IntelligenceWebClient.service('PlaysManager', [
    '$injector', 'Utilities', 'FIELD_TYPE', 'AlertsService', 'TagsManager', 'PlayManager', 'EventManager', 'PlaysFactory', 'GamesFactory', 'TagsetsFactory',
    function service($injector, utilities, FIELD_TYPE, alerts, tagsManager, playManager, eventManager, plays, games, tagsets) {

        var period;
        var indexing;
        var indexedScore;
        var opposingIndexedScore;

        this.plays = [];

        /**
         * Resets the plays.
         * @param {Array} plays - array to set the plays to.
         */
        this.reset = function(plays) {

            plays = plays || [];

            this.plays = plays;
        };

        /**
         * Gets the last play.
         */
        this.getLastPlay = function() {

            /* Sort the events by time. */
            this.plays.sort(utilities.compareStartTimes);

            return this.plays[this.plays.length - 1];
        };

        /* Returns the index of a play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Number} index
         */
        this.getIndex = function(currentPlay) {
            return this.plays.indexOf(currentPlay);
        };

        /* Retrieves the previous play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Object} previousPlay
         */
        this.getPreviousPlay = function(currentPlay) {
            var index = this.plays.indexOf(currentPlay);
            return (--index >= 0) ? this.plays[index] : null;
        };

        /* Retrieves the next play in a sequence of plays
         * @param {Object} currentPlay
         * @return {Object} nextPlay
         */
        this.getNextPlay = function(currentPlay) {
            var index = this.plays.indexOf(currentPlay);
            return (++index < this.plays.length) ? this.plays[index] : null;
        };

        /**
         * Adds a play.
         * @param {Object} play - play to be added.
         */
        this.addPlay = function(play) {

            var index = 0;

            while (
                index < this.plays.length &&
                play.startTime > this.plays[index].startTime) {

                index++;
            }

            /* Insert the play into the appropriate index. */
            this.plays.splice(index, 0, play);

            this.calculatePlays();
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.removePlay = function(play) {

            var playIndex = this.plays.indexOf(play);

            /* If the play exists in the play list. */
            if (~playIndex) {

                /* Remove play from play list. */
                this.plays.splice(playIndex, 1);
            }

            /* If the deleted play is the current play. */
            if (angular.equals(play, playManager.current)) {

                indexing = indexing || $injector.get('IndexingService');

                indexing.showTags = false;
                indexing.showScript = false;
                indexing.isIndexing = false;
                indexing.eventSelected = false;

                playManager.clear();
                tagsManager.reset();
                eventManager.current = new KrossoverEvent();
            }

            this.calculatePlays();
        };

        /**
         * Calculate the details for each play.
         */
        this.calculatePlays = function() {

            period = 0;
            indexedScore = 0;
            opposingIndexedScore = 0;

            this.plays.sort(utilities.compareStartTimes);
            this.plays.forEach(calculatePlay);
        };

        function calculatePlay (play, index) {

            /* Record the order of the play in the playlist. */
            play.number = index;

            /* Sort the events by time. */
            play.events.sort(utilities.compareTimes);

            for (let event of play.events) {

                calculateEvent(play, event);
            }
        }

        function calculateEvent (play, event) {

            let teamId;
            let game = games.get(play.gameId);

            /* If the event is a period event, then advance the period. */
            if (event.isPeriodTag) period++;

            /* Set the period of the play. */
            play.period = period;

            /* If at least one event has a user script, the play is visible. */
            if (event.userScript !== null) play.hasVisibleEvents = true;

            /* Look at the first position script field. */
            /* TODO: Clear up once fields are indexed by position and not the
             * tag variable ID. */
            let fields = event.fields;
            if (!fields) return;
            let fieldValues = event.variableValues;
            let firstField = fields[1];
            if (!firstField) return;
            let firstFieldId = firstField.id;
            let field = fieldValues[firstFieldId];

            /* If the field value is defined. */
            if (angular.isDefined(field.value)) {

                /* If its a team field. */
                if (field.type === FIELD_TYPE.TEAM) {

                    /* The field value is a teamId. */
                    teamId = field.value;
                }

                /* If its a player field. */
                else if (field.type === FIELD_TYPE.PLAYER) {

                    teamId = game.isPlayerOnTeam(field.value) ? game.teamId : game.opposingTeamId;
                }

                /* Consider the first team to take possession in a play to have
                 * possession for the remainder of the play. */
                if (!play.possessionTeamId) play.possessionTeamId = teamId;

                /* If the tag has points to assign. */
                if (event.pointsAssigned) {

                    /* If this team is the team. */
                    if (game.teamId == teamId) {

                        /* If the points should be assigned to the variable team. */
                        if (event.assignThisTeam) {

                            /* Assign the points to this team. */
                            indexedScore += event.pointsAssigned;
                        }

                        /* If the points should be assigned to the other team. */
                        else {

                            /* Assign the points to the other team. */
                            opposingIndexedScore += event.pointsAssigned;
                        }
                    }

                    /* If this team is the opposing team.*/
                    else if (game.opposingTeamId == teamId) {

                        /* If the points should be assigned to the variable team. */
                        if (event.assignThisTeam) {

                            /* Assign the points to this team. */
                            opposingIndexedScore += event.pointsAssigned;
                        }

                        /* If the points should be assigned to the other team. */
                        else {

                            /* Assign the points to the other team. */
                            indexedScore += event.pointsAssigned;
                        }
                    }
                }
            }

            /* Set scores on the play. */
            play.indexedScore = indexedScore;
            play.opposingIndexedScore = opposingIndexedScore;
        }
    }
]);
