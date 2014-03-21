
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
    function() {

        return function(time) {

            var seconds = moment.duration(time).seconds();
            var minutes = moment.duration(time).minutes();

            return minutes + ':' + seconds;
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
 * Indexing controller.
 * @module Indexing
 * @name Controller
 * @type {Controller}
 */
Indexing.controller('indexing.Controller', [
    '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', '$modal', 'VIDEO_STATUSES', 'GAME_STATUSES', 'VG_EVENTS', 'AlertsService', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'indexing.Sidebar',
    function controller($window, $rootScope, $scope, $sce, $state, $stateParams, $modal, VIDEO_STATUSES, GAME_STATUSES, VG_EVENTS, alerts, indexing, plays, players, sidebar) {

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

        this.currentPlay = {};
        this.currentPlay.gameId = this.game.id;
        this.currentPlay.events = [];
        this.currentEvent = angular.copy(eventModel);
        this.currentTags = indexing.getStartTags();


        /* Bind keys. */


        Mousetrap.bind('space', function(event) {

            if ($scope.isReady) $scope.VideoPlayer.playPause();

            return false;
        });

        Mousetrap.bind('enter', function(event) {

            if ($scope.isIndexing && !self.currentTags.length && self.savable()) self.save();
            else if ($scope.isIndexing && !self.currentTags.length && !self.savable()) self.next();
            else if ($scope.isReady) self.index();

            $scope.$apply();

            return false;
        });

        Mousetrap.bind('esc', function(event) {

            if ($scope.isIndexing) self.back();

            $scope.$apply();

            return false;
        });


        /* Controller methods */


        /**
         * Indexes an event.
         */
        this.index = function() {

            $scope.isStarted = true;
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
            self.currentPlay.events.splice(self.currentPlay.events.indexOf(self.currentEvent), 1);

            plays.save(self.currentPlay).then(

                function success() {

                    self.plays = plays.getList(self.game.id);

                    /* If there are no events left in the play. */
                    if (self.currentPlay.events.length === 0) {

                        /* Escape back to initial indexing state. */
                        self.currentTags = indexing.getStartTags();
                        self.currentEvent = angular.copy(eventModel);

                    } else {

                        /* Clear current tags. */
                        self.currentTags = [];

                        /* Set the current event to the previous event. */
                        var previousEventIndex = self.currentPlay.events.length - 1;
                        var previousEvent = self.currentPlay.events[previousEventIndex];
                        angular.copy(previousEvent, self.currentEvent);

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

            this.currentPlay = {};
            this.currentPlay.gameId = indexing.game.id;
            this.currentPlay.events = [];
            this.currentEvent = angular.copy(eventModel);
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
                    if (angular.equals(play, self.currentPlay)) {

                        self.createPlay();
                        self.currentTags = indexing.getNextTags(self.currentEvent.tag.id);
                    }

                    self.plays = plays.getList(self.game.id);
                });
            });
        };

        /**
         * Advances to next set of tags.
         */
        this.next = function() {

            $scope.isIndexing = false;

            var event = angular.copy(this.currentEvent);

            if (event.tag && event.tag.id) {

                /* Get the tagId of the current event. */
                var tagId = this.currentEvent.tag.id;

                /* Add the event to the current play. */
                this.currentPlay.events.push(event);

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
            if (this.currentPlay.events.length === 0 || this.currentEvent.id) {

                /* Escape back to initial indexing state. */
                $scope.VideoPlayer.play();
                $scope.isIndexing = false;
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
            }

            /* Remove event from the play. */
            this.currentPlay.events.pop();
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

            self.next();

            plays.save(self.currentPlay).then(

                function success() {

                    self.createPlay();
                    self.plays = plays.getList(indexing.game.id);
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

            return !!self.state;
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

