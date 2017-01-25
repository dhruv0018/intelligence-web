import KrossoverEvent from '../entities/event';

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
    '$injector',
    'Utilities',
    'FIELD_TYPE',
    'AlertsService',
    'TagsManager',
    'PlayManager',
    'EventManager',
    'PlaysFactory',
    'GamesFactory',
    'TeamsFactory',
    'TagsetsFactory',
    'PlaylistEventEmitter',
    'EVENT',
    'SPORT_IDS',
    'SPORTS',
    function service(
        $injector,
        utilities,
        FIELD_TYPE,
        alerts,
        tagsManager,
        playManager,
        eventManager,
        plays,
        games,
        teams,
        tagsets,
        playlistEventEmitter,
        EVENT,
        SPORT_IDS,
        SPORTS
    ) {

        var period;
        var indexing;
        var indexedScore; // For sports based on sets, this is the number of sets won
        var opposingIndexedScore;
        var runningScore; // For sports based on sets, this is the score within the set
        var opposingRunningScore;

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
                eventManager.current = null;
            }

            this.calculatePlays();
        };

        /**
         * Calculate the details for each play.
         */
        this.calculatePlays = function() {
            period = 0;
            indexedScore = 0;
            runningScore = 0;
            opposingIndexedScore = 0;
            opposingRunningScore = 0;
            this.plays.sort(utilities.compareStartTimes);
            this.plays.forEach(calculatePlay);

            playlistEventEmitter.emit(EVENT.PLAYLIST.PLAYS.CALCULATE, this.plays);
        };

        function calculatePlay (play, index) {

            /* Record the order of the play in the playlist. */
            play.number = index + 1;

            /* Sort the events by time. */
            play.events.sort(utilities.compareTimes);

            for (let i=0; i<play.events.length; i++) {
                let event = play.events[i];
                let fields = event.fields;

                // Workaround for adding player/team information to service error events

                // TODO: Find a cleaner way to do this - either attaching this information
                // to the event on the backend instead of relying on the previous event or
                // making a more generic solution for pulling information from previous
                // events when needed.
                if(event.tagId == 202 && i>0){
                    let previousEvent = play.events[i-1];
                    fields = previousEvent.fields;
                }

                calculateEvent(play, event, fields);
            }
        }

        function calculateEvent (play, event, fields) {

            let teamId;
            let game = games.get(play.gameId);
            let team = teams.get(game.teamId);
            let sport = team.getSport();

            let scoreBySets = SPORTS[sport.name.toUpperCase().replace(" ", "_")].scoreBySets;

            /* Set the period of the play. */
            play.period = period;

            /* If at least one event has a user script, the play is visible. */
            if (event.userScript !== null) play.hasVisibleEvents = true;

            /* Look at the first position script field. */
            /* TODO: Clear up once fields are indexed by position and not the
             * tag variable ID. */
            if (!fields) return;

            let firstField = fields[1];
            if (!firstField) return;
            let firstFieldId = firstField.index;
            let field = fields[firstFieldId];

            /* If the event is a period event, then reset the period value. */
            if (event.isPeriodTag) {
                period = field.value.name;
                play.period = period;

                if(scoreBySets){
                    runningScore = 0;
                    opposingRunningScore = 0;
                }
            }

            /* If the field value is defined. */
            if (angular.isDefined(field) && angular.isDefined(field.value)) {

                /* If its a team field. */
                if(field.value.type == FIELD_TYPE.TEAM){
                    teamId = field.value.id;
                }
                else{
                    teamId = field.value.teamId;
                }


                /* If its a player field. */
                if (!teamId) {

                    let playerId = field.value.id;
                    teamId = playerId && game.isPlayerOnTeam(playerId) ? game.teamId : game.opposingTeamId;

                    if (!teamId) {

                        console.warn('WARNING: Missing `teamId` in Field!', field);
                    } else {
                        /* Make sure that the possessionTeamId is of the team serving for Volleyball */
                        if (event.name === 'Serve') {
                            play.possessionTeamId = teamId;
                        }
                    }
                }

                /* Consider the first team to take possession in a play to have
                 * possession for the remainder of the play except for four soccer events. */
                if (!play.possessionTeamId) {
                    let tag = event.tagId;

                    // TODO: This is a temporary workaround solution to non posession sports displaying
                    // the correct team in the play header. Handles Throw-In, Goal Kick, Kickoff, and Restart
                    // events for soccer.

                    if(tag == 268 || tag == 269 || tag == 270 || tag == 271) {
                        play.possessionTeamId = event.fields[2]._value.teamId;
                    }
                    else {
                        play.possessionTeamId = teamId;
                    }
                }

                // If the sport is scored by sets and a set won tag is encountered,
                // increment the proper team's indexed score.
                if(event.tagId == 19 && scoreBySets) {

                    if (game.teamId == teamId) {
                        indexedScore++;
                    }
                    else{
                        opposingIndexedScore++;
                    }
                }

                /* If the tag has points to assign. */
                if (event.pointsAssigned) {

                    /* If this team is the team. */
                    if (game.teamId == teamId) {

                        /* If the points should be assigned to the variable team. */
                        if (event.assignThisTeam) {

                            /* Assign the points to this team. */
                            runningScore += event.pointsAssigned;

                            if(!scoreBySets){
                                indexedScore += event.pointsAssigned;
                            }
                        }

                        /* If the points should be assigned to the other team. */
                        else {

                            /* Assign the points to the other team. */
                            opposingRunningScore += event.pointsAssigned;

                            if(!scoreBySets){
                                opposingIndexedScore += event.pointsAssigned;
                            }
                        }
                    }

                    /* If this team is the opposing team.*/
                    else if (game.opposingTeamId == teamId) {

                        /* If the points should be assigned to the variable team. */
                        if (event.assignThisTeam) {

                            /* Assign the points to this team. */
                            opposingRunningScore += event.pointsAssigned;

                            if(!scoreBySets){
                                opposingIndexedScore += event.pointsAssigned;
                            }
                        }

                        /* If the points should be assigned to the other team. */
                        else {

                            /* Assign the points to the other team. */
                            runningScore += event.pointsAssigned;

                            if(!scoreBySets){
                                indexedScore += event.pointsAssigned;
                            }
                        }
                    }
                }
            }

            /* Set scores on the play. */
            play.indexedScore = indexedScore;
            play.runningScore = runningScore;
            play.opposingIndexedScore = opposingIndexedScore;
            play.opposingRunningScore = opposingRunningScore;
        }
    }
]);
