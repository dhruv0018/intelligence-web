
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('indexing');

var eventModel = {

    variableValues: {}
};

Indexing.value('indexing.Sidebar', {

    notes: false,
    playlist: false
});

/**
 * Indexing controller.
 * @module Indexing
 * @name Controller
 * @type {Controller}
 */
Indexing.controller('indexing.Controller', [
    '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', 'VIDEO_STATUSES', 'VG_EVENTS', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'indexing.Sidebar',
    function controller($window, $rootScope, $scope, $sce, $state, $stateParams, VIDEO_STATUSES, VG_EVENTS, indexing, plays, players, sidebar) {

        var self = this;

        var HOME = $scope.HOME = 0;
        var AWAY = $scope.AWAY = 1;

        this.game = indexing.game;
        this.plays = indexing.plays;
        this.league = indexing.league;
        this.players = indexing.players;

        this.period = 1;
        this.league.periodLabel = 'Set';  /* FIXME: TEMP */

        this.scores = [];
        this.scores[HOME] = this.game.finalScore;
        this.scores[AWAY] = this.game.opposingFinalScore;

        this.colors = [];
        this.colors[HOME] = this.game.primaryJerseyColor;
        this.colors[AWAY] = this.game.opposingPrimaryJerseyColor;

        this.teams = [];
        this.teams[HOME] = indexing.team;
        this.teams[AWAY] = indexing.opposingTeam;

        this.plays = this.plays || [];
        this.currentPlay = {};
        this.currentPlay.gameId = this.game.id;
        this.currentPlay.events = [];
        this.currentEvent = angular.copy(eventModel);
        this.currentTags = indexing.getStartTags();


        /* Bind keys. */


        Mousetrap.bind('space', function(event) {

            event.preventDefault();
            self.index();
            return false;
        });


        /* Controller methods */


        /**
         * Starts an indexing session.
         */
        this.start = function() {

            $scope.VideoPlayer.play();
        };

        /**
         * Indexes an event.
         */
        this.index = function() {

            $scope.VideoPlayer.pause();
        };

        /**
         * Selects a tag.
         * @param {Integer} tagId - the ID of the tag selected.
         */
        this.selectTag = function(tagId) {

            /* Clear current tags. */
            this.currentTags = [];

            /* Create new event. */
            this.currentEvent = angular.copy(eventModel);
            this.currentEvent.tag = indexing.tags[tagId];
            this.currentEvent.time = getCurrentTime();
        };

        /**
         * Select an event to use as the current event.
         */
        this.selectEvent = function(play, event) {

            $scope.VideoPlayer.pause();

            /* Clear current tags. */
            this.currentTags = [];

            /* Set the current time to the time from the selected event. */
            setCurrentTime(event.time);

            /* Set the current play and event to match the selected event. */
            this.currentPlay = play;
            this.currentEvent = event;
        };

        /**
         * Deletes the current event.
         */
        this.deleteCurrentEvent = function() {

            /* Remove current event from the current play. */
            this.currentPlay.events.splice(this.currentPlay.events.indexOf(this.currentEvent), 1);

            /* Save the current play.*/
            this.plays = plays.save(this.currentPlay);

            /* Return to initial indexing state. */
            this.state = 'READY';
            this.currentTags = indexing.getStartTags();
            this.currentEvent = angular.copy(eventModel);
        };

        /**
         * Deletes a play.
         */
        this.deletePlay = function(play) {

            /* TODO: Add prompt for delete. */

            /* Remove current event from the plays. */
            this.plays.splice(this.plays.indexOf(play), 1);

            /* Delete the play. */
            this.plays = plays.remove(play);
        };

        /**
         * Advances to next set of tags.
         */
        this.next = function() {

            /* Get the tagId of the current event. */
            var tagId = this.currentEvent.tag.id;

            /* Add the event to the current play. */
            var event = angular.copy(this.currentEvent);
            this.currentPlay.events.push(event);

            /* Get the next set of tags based on the tag in the current event. */
            this.currentTags = indexing.getNextTags(tagId);

            $scope.VideoPlayer.play();
        };

        /**
         * Moves backwards through previously indexed events and plays.
         */
        this.back = function() {

            $scope.VideoPlayer.pause();

            /* If there are no events left in the play or if the current event
             * has been saved already. */
            if (this.currentPlay.events.length === 0 || this.currentEvent.id) {

                /* Escape back to initial indexing state. */
                this.state = 'READY';
                this.currentTags = indexing.getStartTags();
                this.currentEvent = angular.copy(eventModel);

            } else {

                /* Clear current tags. */
                this.currentTags = [];

                /* Set the current event to the previous event. */
                var previousEventIndex = this.currentPlay.events.length - 1;
                var previousEvent = this.currentPlay.events[previousEventIndex];
                angular.copy(previousEvent, this.currentEvent);

                /* Set the current time to the time from the previous event. */
                setCurrentTime(previousEvent.time);

                /* Remove event from the play. */
                this.currentPlay.events.pop();
            }
        };

        /**
         * Determines if the current indexing session is savable.
         * @returns {Boolean} true if the session is savable; false otherwise.
         */
        this.savable = function() {

            return indexing.isEndEvent(this.currentEvent);
        };

        /**
         * Saves the current play.
         */
        this.save = function() {

            self.state = 'SAVING';

            /* Add the event to the current play. */
            var event = angular.copy(this.currentEvent);
            this.currentPlay.events.push(event);

            plays.save(self.currentPlay).then(

                function success() {

                    self.state = 'SAVED';

                    self.plays = plays.getList(self.game.id);
                    self.currentPlay = {};
                    self.currentPlay.gameId = self.game.id;
                    self.currentPlay.events = [];
                    self.currentTags = indexing.getNextTags(self.currentEvent.tag.id);
                    self.currentEvent = angular.copy(eventModel);
                },

                function error() {

                    self.state = 'SAVE_ERROR';
                }
            );
        };


        /* Scope */


        $scope.sidebar = sidebar;
        $scope.buildScript = indexing.buildScript;
        $scope.sources = indexing.game.video.sources;


        /* Scope methods */


        $scope.isString = function(item) {

            return angular.isString(item);
        };

        $scope.goBack = function() {

            $scope.indexing.game.save();
            $state.go('indexer-game', { id: $scope.indexing.game.id });
        };

        $scope.isReadyForQa = function() {

            return false;
        };

        $scope.sendToQa = function() {

            /* TODO: Send to QA */
        };

        $scope.toggleNotes = function() {

            sidebar.notes = !sidebar.notes;
            sidebar.playlist = false;

            $scope.$watch('sidebar.notes', function() {

                $scope.$evalAsync(function() {

                    angular.element($window).triggerHandler('resize');
                });
            });
        };

        $scope.togglePlaylist = function() {

            sidebar.notes = false;
            sidebar.playlist = !sidebar.playlist;

            $scope.$watch('sidebar.playlist', function() {

                $scope.$evalAsync(function() {

                    angular.element($window).triggerHandler('resize');
                });
            });
        };


        /* Listeners for video player events */


        /**
         * Listen for video player ready event.
         */
        $scope.$on(VG_EVENTS.ON_PLAYER_READY, function() {

            self.state = 'READY';
        });

        /**
         * Listen for video player play event.
         */
        $scope.$on(VG_EVENTS.ON_PLAY, function() {

            self.state = 'PLAYING';
        });

        /**
         * Listen for video player pause event.
         */
        $scope.$on(VG_EVENTS.ON_PAUSE, function() {

            self.state = 'INDEXING';
        });

        /**
         * Listen for video player enter full screen event.
         */
        $rootScope.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, function() {

            var element = document.getElementsByClassName('indexing-block')[0];
            element.classList.add('fullscreen');
        });

        /**
         * Listen for video player exit full screen event.
         */
        $rootScope.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, function() {

            var element = document.getElementsByClassName('indexing-block')[0];
            element.classList.remove('fullscreen');
        });


        /* Private methods */


        /**
         * Gets the current time from the video.
         * @returns {Integer} - current time.
         */
        var getCurrentTime = function() {

            return $scope.VideoPlayer.videoElement[0].currentTime;
        };

        /**
         * Sets the current time in the video. Seeks video to that time.
         * @param {Integer} time - time to seek video to.
         */
        var setCurrentTime = function(time) {

            $scope.VideoPlayer.seekTime(time);
        };
    }
]);

