
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

var moment = require('moment');

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
 * Filters time in milliseconds into humanized format
 * @module Indexing
 * @name time
 * @type {Filter}
 */
Indexing.filter('time', [
    function filter() {

        return function(time) {

            var duration = moment.duration(time, 'seconds');
            var seconds = duration.seconds();
            var minutes = duration.minutes();

            return minutes + ':' + seconds;
        };
    }
]);

/**
 * @module Indexing
 * @name EventService
 * @type {service}
 */
Indexing.service('indexing.EventService', [
    function service() {

        this.model = {

            variableValues: {}
        };

        this.current = null;
    }
]);

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name ModalController
 * @type {Controller}
 */
Indexing.controller('ModalController', [
    '$scope', '$modal', '$modalInstance',
    function controller($scope, $modal, $modalInstance) {

        $scope.ok = function() {

            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };
    }
]);

/**
 * Indexing header controller.
 * @module Indexing
 * @name indexing-header.Controller
 * @type {Controller}
 */
Indexing.controller('indexing.Header.Controller', [
    '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', '$modal', 'VIDEO_STATUSES', 'GAME_STATUSES', 'VG_EVENTS', 'AlertsService', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'indexing.Sidebar',
    function controller($window, $rootScope, $scope, $sce, $state, $stateParams, $modal, VIDEO_STATUSES, GAME_STATUSES, VG_EVENTS, alerts, indexing, plays, players, sidebar) {

        $scope.sidebar = sidebar;

        $scope.indexing = indexing;

        $scope.goBack = function() {

            $scope.indexing.game.save();
            $state.go('indexer-game', { id: $scope.indexing.game.id });
        };

        $scope.sendToQa = function() {

            $scope.indexing.game.status = GAME_STATUSES.READY_FOR_QA.id;
            $scope.goBack();
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
    }
]);

/**
 * Indexing controller.
 * @module Indexing
 * @name indexing.Controller
 * @type {Controller}
 */
Indexing.controller('indexing.Main.Controller', [
    'config', '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', '$modal', 'VIDEO_STATUSES', 'GAME_STATUSES', 'VG_EVENTS', 'AlertsService', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'indexing.currentPlay', 'indexing.EventService', 'indexing.Sidebar',
    function controller(config, $window, $rootScope, $scope, $sce, $state, $stateParams, $modal, VIDEO_STATUSES, GAME_STATUSES, VG_EVENTS, alerts, indexing, plays, players, currentPlay, event, sidebar) {

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

            if ($scope.isIndexing && !self.currentTags.length) {

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
         * @param {Integer} tagId - the ID of the tag selected.
         */
        this.selectTag = function(tagId) {

            /* Clear current tags. */
            this.currentTags = [];

            /* Create new event. */
            event.current = angular.copy(eventModel);
            event.current.tag = indexing.tags[tagId];
            event.current.time = getCurrentTime();
        };

        /**
         * Select an event to use as the current event.
         */
        this.selectEvent = function(play, event) {

            $scope.isIndexing = true;

            $scope.VideoPlayer.pause();

            /* Clear current tags. */
            this.currentTags = [];

            /* Set the current time to the time from the selected event. */
            setCurrentTime(event.time);

            /* Set the current play and event to match the selected event. */
            currentPlay = play;
            event.current = event;
        };

        /**
         * Deletes the current event.
         */
        this.deleteCurrentEvent = function() {

            /* Remove current event from the current play. */
            currentPlay.events.splice(currentPlay.events.indexOf(event.current), 1);

            plays.save(currentPlay).then(

                function success() {

                    indexing.plays = plays.getList(indexing.game.id);

                    /* If there are no events left in the play. */
                    if (currentPlay.events.length === 0) {

                        /* Escape back to initial indexing state. */
                        self.currentTags = indexing.getStartTags();
                        event.current = angular.copy(eventModel);

                    } else {

                        /* Clear current tags. */
                        self.currentTags = [];

                        /* Set the current event to the previous event. */
                        var previousEventIndex = currentPlay.events.length - 1;
                        var previousEvent = currentPlay.events[previousEventIndex];
                        angular.copy(previousEvent, event.current);

                        /* Set the current time to the time from the previous event. */
                        setCurrentTime(previousEvent.time);
                    }
                },

                function error() {

                    alerts.add({

                        type: 'danger',
                        message: 'Failed to save event'
                    });
                }
            );
        };

        /**
         * Creates a play.
         */
        this.createPlay = function() {

            currentPlay = {};
            currentPlay.gameId = indexing.game.id;
            currentPlay.events = [];
            event.current = angular.copy(eventModel);
        };

        /**
         * Deletes a play.
         */
        this.deletePlay = function(play) {

            $modal.open({

                controller: 'ModalController',
                templateUrl: 'delete-play.html'

            }).result.then(function() {

                plays.remove(play).then(function() {

                    /* If the deleted play is the current play. */
                    if (angular.equals(play, currentPlay)) {

                        self.createPlay();
                        self.currentTags = indexing.getNextTags(event.current.tag.id);
                    }

                    indexing.plays = plays.getList(indexing.game.id);
                });
            });
        };

        /**
         * Advances to next set of tags.
         */
        this.next = function() {

            $scope.isIndexing = false;

            var event = angular.copy(event.current);

            if (event.tag && event.tag.id) {

                /* Get the tagId of the current event. */
                var tagId = event.current.tag.id;

                /* Add the event to the current play. */
                currentPlay.events.push(event);

                /* Get the next set of tags based on the tag in the current event. */
                this.currentTags = indexing.getNextTags(tagId);

                $scope.VideoPlayer.play();
            }
        };

        /**
         * Moves backwards through previously indexed events and plays.
         */
        this.back = function() {

            /* If there are no events left in the play or if the current event
             * has been saved already. */
            if (currentPlay.events.length === 0 || event.current.id) {

                /* Escape back to initial indexing state. */
                $scope.VideoPlayer.play();
                $scope.isIndexing = false;
                this.currentTags = indexing.getStartTags();
                event.current = angular.copy(eventModel);

            } else {

                /* Clear current tags. */
                this.currentTags = [];

                /* Set the current event to the previous event. */
                var previousEventIndex = currentPlay.events.length - 1;
                var previousEvent = currentPlay.events[previousEventIndex];
                angular.copy(previousEvent, event.current);

                /* Set the current time to the time from the previous event. */
                setCurrentTime(previousEvent.time);
            }

            /* Remove event from the play. */
            currentPlay.events.pop();
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

            self.next();

            plays.save(currentPlay).then(

                function success() {

                    self.createPlay();
                    indexing.plays = plays.getList(indexing.game.id);
                },

                function error() {

                    alerts.add({

                        type: 'danger',
                        message: 'Failed to save event'
                    });
                }
            );
        };


        /* Scope */


        $scope.currentPlay = currentPlay;
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

            self.createPlay();
            self.currentTags = indexing.getStartTags();

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

