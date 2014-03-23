
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
 * @name TagsService
 * @type {service}
 */
Indexing.service('indexing.TagsService', [
    'IndexingService',
    function service(indexing) {

        this.current = indexing.getStartTags();

        this.clear = function() {

            this.current = [];
        };
    }
]);

/**
 * @module Indexing
 * @name PlayService
 * @type {service}
 */
Indexing.service('indexing.PlayService', [
    '$modal', 'AlertsService', 'PlaysFactory', 'IndexingService', 'indexing.TagsService',
    function service($modal, alerts, plays, indexing, tags) {

        var model = {

            gameId: indexing.game.id,
            events: []
        };

        this.current = angular.copy(model);
        indexing.plays.push(this.current);

        /**
         * Creates a play.
         */
        this.create = function() {

            this.current = angular.copy(model);
            indexing.plays.push(this.current);
        };

        /**
         * Saves a play.
         */
        this.save = function() {

            var self = this;

            var play = this.current;
            var playIndex = indexing.plays.indexOf(play);

            plays.save(play).then(

                function success(play) {

                    indexing.plays[playIndex] = play;
                },

                function error() {

                    alerts.add({

                        type: 'danger',
                        message: 'Failed to save play'
                    });
                }
            );
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.remove = function(play) {

            /* If the play has been saved before, also remove it remotely. */
            if (play.id) {

                plays.remove(play).then(

                    function success() {

                        /* Remove play from plays list. */
                        indexing.plays.splice(indexing.plays.indexOf(play), 1);
                    },

                    function error() {

                        alerts.add({

                            type: 'danger',
                            message: 'Failed to delete play'
                        });
                    }
                );

            } else {

                /* Remove play from plays list. */
                indexing.plays.splice(indexing.plays.indexOf(play), 1);
            }

            /* If the deleted play is the current play. */
            if (angular.equals(play, this.current)) {

                /* Create a new play to use as the current one. */
                this.create();
            }
        };
    }
]);

/**
 * @module Indexing
 * @name EventService
 * @type {service}
 */
Indexing.service('indexing.EventService', [
    'IndexingService', 'indexing.TagsService', 'indexing.PlayService',
    function service(indexing, tags, play) {

        var model = {

            variableValues: {}
        };

        this.current = null;

        /**
         * Resets the current play to the original model.
         */
        this.reset = function() {

            this.current = angular.copy(model);
        };

        /**
         * Creates a new event.
         * Creates an event with a tag specified by the tagId and time.
         * @param {Number} tagId - the ID of a tag.
         * @param {Number} time - the time the event took place.
         */
        this.create = function(tagId, time) {

            this.reset();

            /* Lookup and set the tag from the indexing tags. */
            this.current.tag = indexing.tags[tagId];

            this.current.time = time;

            /* Add event to the current play. */
            play.current.events.push(this.current);
        };

        /**
         * Deletes the current event.
         */
        this.delete = function() {

            /* Remove current event from the current play. */
            play.current.events.splice(play.current.events.indexOf(this.current), 1);

            /* If there are other events left in the play. */
            if (play.current.events.length > 0) {

                /* Set the current event to the previous event. */
                var previousEventIndex = play.current.events.length - 1;
                var previousEvent = play.current.events[previousEventIndex];
                angular.copy(previousEvent, event.current);
                play.save();

            /* If there are no events left in the play. */
            } else {

                this.reset();
                play.remove(play.current);
            }
        };
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
    'config', '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', '$modal', 'VIDEO_STATUSES', 'GAME_STATUSES', 'VG_EVENTS', 'AlertsService', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'indexing.TagsService', 'indexing.PlayService', 'indexing.EventService', 'indexing.Sidebar',
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
         * Select an event to use as the current event.
         */
        this.selectEvent = function(play, event) {

            $scope.isIndexing = true;

            $scope.VideoPlayer.pause();

            /* Clear current tags. */
            tags.clear();

            /* Set the current time to the time from the selected event. */
            setCurrentTime(event.time);

            /* Set the current play and event to match the selected event. */
            play.current = play;
            event.current = event;
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

