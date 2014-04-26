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
    'config', '$window', '$rootScope', '$scope', '$sce', '$state', '$stateParams', '$modal', 'VIDEO_STATUSES', 'GAME_STATUSES', 'VG_EVENTS', 'SessionService', 'AlertsService', 'IndexingService', 'PlaysFactory', 'PlayersFactory', 'TagsManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar',
    function controller(config, $window, $rootScope, $scope, $sce, $state, $stateParams, $modal, VIDEO_STATUSES, GAME_STATUSES, VG_EVENTS, session, alerts, indexing, plays, players, tags, play, event, sidebar) {

        var self = this;


        /* Scope */


        $scope.tags = tags;
        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
        $scope.buildScript = indexing.buildScript;
        $scope.sources = indexing.game.video.sources;

        if (!indexing.game.isAssignmentStarted()) {

            var userId = session.currentUser.id;
            indexing.game.startAssignment(userId);
            indexing.game.save();
        }

        /* Bind keys. */


        Mousetrap.bindGlobal('space', function() {

            $scope.$apply(function() {

                if (indexing.isReady) $scope.VideoPlayer.playPause();
            });

            return false;
        });

        Mousetrap.bindGlobal('left', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = getCurrentTime();
                    var time = currentTime - config.indexing.video.jump;
                    $scope.VideoPlayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bindGlobal('right', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = getCurrentTime();
                    var time = currentTime + config.indexing.video.jump;
                    $scope.VideoPlayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bindGlobal('enter', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) {

                    if(self.savable()) self.save();
                    else if (self.nextable()) self.next();
                }

                else if (indexing.isReady) self.index();
            });

            return false;
        });

        Mousetrap.bindGlobal('esc', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) self.back();
            });

            return false;
        });


        /* Controller methods */


        /**
         * Indexes an event.
         */
        this.index = function() {

            indexing.isIndexing = true;
            indexing.showTags = true;
            indexing.showScript = false;
            indexing.eventSelected = false;
            $scope.VideoPlayer.pause();
        };

        /**
         * Selects a tag.
         * @param {Number} tagId - the ID of the tag selected.
         */
        this.selectTag = function(tagId) {

            /* Get current time from the video. */
            var time = getCurrentTime();

            /* Create new event. */
            event.create(tagId, time);

            indexing.showTags = false;
            indexing.showScript = true;
        };

        /**
         * Determines if the current indexing session is savable.
         * @returns {Boolean} true if the session is savable; false otherwise.
         */
        this.savable = function() {

            return indexing.eventSelected ||
                   indexing.isEndEvent(event.current);
        };

        /**
         * Saves the current play.
         */
        this.save = function() {

            play.save();
            play.clear();

            if (indexing.eventSelected) this.back();
            else this.next();
        };

        /**
         * Determines if the current indexing session can be advanced.
         * @returns {Boolean} true if the session can be advanced; false otherwise.
         */
        this.nextable = function() {

            /* If there are variables. */
            if (event.hasVariables()) {

                /* Make sure all of the variables have values. */
                return event.allEventVariablesHaveValues();
            }

            /* Otherwise; assume the session can be advanced. */
            else return true;
        };

        /**
         * Advances to next set of tags.
         */
        this.next = function() {

            indexing.showTags = false;
            indexing.showScript = false;
            indexing.isIndexing = false;
            indexing.eventSelected = false;

            /* Get the tagId of the current event. */
            var tagId = event.current.tag.id;

            /* Get the next set of tags based on the tag in the current event. */
            tags.current = indexing.getNextTags(tagId);

            event.reset();

            $scope.VideoPlayer.play();
        };

        /**
         * Moves backwards through previously indexed events and plays.
         */
        this.back = function() {

            /* If editing an event. */
            if (indexing.eventSelected) {

                indexing.showTags = false;
                indexing.showScript = false;
                indexing.isIndexing = false;
                indexing.eventSelected = false;

                tags.reset();
                event.reset();
            }

            /* If the tags are showing. */
            else if (indexing.showTags) {

                /* Drop back into not indexing state. */
                indexing.showTags = false;
                indexing.showScript = false;
                indexing.isIndexing = false;
                $scope.VideoPlayer.play();
            }

            /* If the first variable is empty. */
            else if (event.current.activeEventVariableIndex === 1 &&
                    !event.activeEventVariableValue()) {

                /* Remove the event from the play. */
                event.delete(event.current);

                /* Drop back to tagging state. */
                indexing.showTags = true;
                indexing.showScript = false;
            }

            /* If the another variable after the first is empty. */
            else if (!event.activeEventVariableValue()) {

                /* Move back one variable. */
                --event.current.activeEventVariableIndex;

                /* Clear the variable before. */
                event.clearActiveEventVariableValue();
            }

            /* If the active variable has a value. */
            else if (event.activeEventVariableValue()) {

                /* Clear the active variables value. */
                event.clearActiveEventVariableValue();
            }
        };

        /**
         * Deletes an event.
         * @param {Object} event - the event to delete.
         */
        this.deleteEvent = function(selectedEvent) {

            /* Remove the event from the play. */
            event.delete(selectedEvent);

            play.clear();

            this.back();
        };


        /* Listeners for video player events */


        /**
         * Listen for video player ready event.
         */
        $scope.$on(VG_EVENTS.ON_PLAYER_READY, function() {

            if ($scope.VideoPlayer) {

                $scope.VideoPlayer.videoElement.one('canplay', function() {

                    indexing.isReady = true;
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
