/* Fetch angular from the browser scope */
var angular = window.angular;

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Indexing controller.
 * @module Indexing
 * @name Main.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Main.Controller', [
    'config', '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', '$modal', 'VIDEO_STATUSES', 'GAME_STATUSES', 'VG_EVENTS', 'AlertsService', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'Indexing.TagsService', 'Indexing.PlayService', 'Indexing.EventService', 'Indexing.Sidebar',
    function controller(config, $window, $rootScope, $scope, $sce, $state, $stateParams, $modal, VIDEO_STATUSES, GAME_STATUSES, VG_EVENTS, alerts, indexing, plays, players, tags, play, event, sidebar) {

        var self = this;

        $scope.indexing = indexing;


        /* Bind keys. */


        Mousetrap.bindGlobal('space', function(event) {

            if ($scope.isReady) $scope.VideoPlayer.playPause();

            return false;
        });

        Mousetrap.bindGlobal('left', function(event) {

            if ($scope.isReady) {

                var currentTime = getCurrentTime();
                var time = currentTime - config.indexing.video.jump;
                $scope.VideoPlayer.seekTime(time);
            }

            return false;
        });

        Mousetrap.bindGlobal('right', function(event) {

            if ($scope.isReady) {

                var currentTime = getCurrentTime();
                var time = currentTime + config.indexing.video.jump;
                $scope.VideoPlayer.seekTime(time);
            }

            return false;
        });

        Mousetrap.bindGlobal('enter', function(event) {

            if ($scope.isIndexing && !tags.current.length) {

                if(self.savable()) self.save();
                else self.next();
            }

            else if ($scope.isReady) self.index();

            $scope.$apply();

            return false;
        });

        Mousetrap.bindGlobal('esc', function(event) {

            if ($scope.isIndexing) self.back();

            $scope.$apply();

            return false;
        });


        /* Controller methods */


        /**
         * Indexes an event.
         */
        this.index = function() {

            $scope.isIndexing = true;

            $scope.VideoPlayer.pause();
        };

        /**
         * Selects a tag.
         * @param {Number} tagId - the ID of the tag selected.
         */
        this.selectTag = function(tagId) {

            /* Get current time from the video. */
            var time = getCurrentTime();

            /* Clear current tags. */
            tags.clear();

            /* Create new event. */
            event.create(tagId, time);
        };

        /**
         * Deletes the current event.
         */
        this.deleteCurrentEvent = function() {

            event.delete();

            /* Set the current time to the time from the previous event. */
            setCurrentTime(event.current.time);
        };

        /**
         * Advances to next set of tags.
         */
        this.next = function() {

            $scope.isIndexing = false;

            /* Get the tagId of the current event. */
            var tagId = event.current.tag.id;

            /* Get the next set of tags based on the tag in the current event. */
            tags.current = indexing.getNextTags(tagId);

            $scope.VideoPlayer.play();
        };

        /**
         * Moves backwards through previously indexed events and plays.
         */
        this.back = function() {

            /* If there are no events left in the play or if the current event
             * has been saved already. */
            if (play.current.events.length === 0 || event.current.id) {

                /* Escape back to initial indexing state. */
                $scope.VideoPlayer.play();
                $scope.isIndexing = false;
                tags.current = indexing.getStartTags();
                event.reset();

            } else {

                /* Clear current tags. */
                tags.clear();

                /* Set the current event to the previous event. */
                var previousEventIndex = play.current.events.length - 1;
                var previousEvent = play.current.events[previousEventIndex];
                angular.copy(previousEvent, event.current);

                /* Set the current time to the time from the previous event. */
                setCurrentTime(previousEvent.time);
            }

            /* Remove event from the play. */
            play.current.events.pop();
        };

        /**
         * Determines if the current indexing session is savable.
         * @returns {Boolean} true if the session is savable; false otherwise.
         */
        this.savable = function() {

            return indexing.isEndEvent(event.current);
        };

        /**
         * Saves the current play.
         */
        this.save = function() {

            this.next();
            play.save();
            play.create();
            event.reset();
        };




        /* Scope */


        $scope.tags = tags;
        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.buildScript = indexing.buildScript;
        $scope.sources = indexing.game.video.sources;


        /* Scope methods */


        /* Listeners for video player events */


        /**
         * Listen for video player ready event.
         */
        $scope.$on(VG_EVENTS.ON_PLAYER_READY, function() {

            if ($scope.VideoPlayer) {

                $scope.VideoPlayer.videoElement.one('canplay', function() {

                    $scope.isReady = true;
                });
            }
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

