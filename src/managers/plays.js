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

            this.plays.push(play);
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
        };

        /**
         * Calculate the details for each play.
         */
        this.calculatePlays = function() {

            console.time('Calculating plays...');

            period = 0;
            indexedScore = 0;
            opposingIndexedScore = 0;

            this.plays.sort(utilities.compareStartTimes);
            this.plays.forEach(calculatePlay);

            console.timeEnd('Calculating plays...');

        };

        function calculatePlay (play, index) {

            /* Record the order of the play in the playlist. */
            play.number = index;

            /* Sort the events by time. */
            play.events.sort(utilities.compareTimes);

            play.events.forEach(calculateEvent);
        }

        function calculateEvent (event, index) {

            let teamId;
            let play = plays.get(event.playId);
            let game = games.get(play.gameId);

            let tagId = event.tagId;
            let tag = tagsets.getTag(tagId);
            let tagVariables = tag.tagVariables;

            /* TODO: extend all events? */
            //angular.extend(event, tag);

            /* If the event is a period event, then advance the period. */
            if (tag.isPeriodTag) play.period = period++;

            /* If at least one event has a user script, the play is visible. */
            //if (tag.userScript !== null) play.hasUserScripts = true;

            if (!tagVariables[1]) return;

            let fields = event.variableValues;

            /* Look at the first position script field. */
            let field = fields[tagVariables[1].id];

            /* If its a team field. */
            if (field.type === FIELD_TYPE.TEAM) {

                /* The field value is a teamId. */
                teamId = field.value;
            }

            /* If its a player field. */
            else if (field.type === FIELD_TYPE.PLAYER) {

                teamId = game.isPlayerOnTeam(field.value) ? game.teamId : game.opposingTeamId;
            }

            /* If one the first event, define possession. */
            if (index === 0) play.possessionTeamId = teamId;

            /* If the tag has points to assign. */
            if (tag.pointsAssigned) {

                /* If this team is the team. */
                if (game.teamId == teamId) {

                    /* If the points should be assigned to the variable team. */
                    if (tag.assignThisTeam) {

                        /* Assign the points to this team. */
                        play.indexedScore = indexedScore = indexedScore + tag.pointsAssigned;
                    }

                    /* If the points should be assigned to the other team. */
                    else {

                        /* Assign the points to the other team. */
                        play.opposingIndexedScore = opposingIndexedScore = opposingIndexedScore + tag.pointsAssigned;
                    }
                }

                /* If this team is the opposing team.*/
                else if (game.opposingTeamId == teamId) {

                    /* If the points should be assigned to the variable team. */
                    if (tag.assignThisTeam) {

                        /* Assign the points to this team. */
                        play.opposingIndexedScore = opposingIndexedScore = opposingIndexedScore + tag.pointsAssigned;
                    }

                    /* If the points should be assigned to the other team. */
                    else {

                        /* Assign the points to the other team. */
                        play.indexedScore = indexedScore = indexedScore + tag.pointsAssigned;
                    }
                }
            }
        }
    }
]);
