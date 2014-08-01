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
    'config', '$rootScope', '$scope', '$modal', 'BasicModals', '$stateParams', 'VG_EVENTS', 'SessionService', 'IndexingService', 'ScriptsService', 'TagsManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data',
    function controller(config, $rootScope, $scope, $modal, basicModal, $stateParams, VG_EVENTS, session, indexing, scripts, tags, play, event, sidebar, data) {

        var self = this;

        var gameId = Number($stateParams.id);

        /* Scope */

        $scope.data = data;
        $scope.tags = tags;
        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
        $scope.game = data.games.get(gameId);
        $scope.team = data.teams.get($scope.game.teamId);
        $scope.opposingTeam = data.teams.get($scope.game.opposingTeamId);
        $scope.league = data.leagues.get($scope.team.leagueId);
        $scope.tagset = data.tagsets.get($scope.league.tagSetId);

        $scope.game.teamIndexedScore = 0;
        $scope.game.opposingIndexedScore = 0;

        /*IF DEADLINE HAS EXPIRED, OPEN MODAL THAT SENDS THEM BACK TO GAMES LIST*/
        var remainingTimeInterval = setInterval(function() {timeLeft();}, 1000);
        function timeLeft() {
            var timeRemaining = $scope.game.assignmentTimeRemaining();
            if (timeRemaining <= 0) {
                clearInterval(remainingTimeInterval);
                var modalInstance = basicModal.openForAlert({
                    title: 'Alert',
                    bodyText: 'The deadline to index this game has passed.'
                });
                modalInstance.result.finally(function() {window.location = 'indexer/games';});
            }
        }

        /* Kick Indexer Off When Deadline Passes */
        /*var deadline = $scope.game.assignmentTimeRemaining();

        if ($scope.game.assignmentTimeRemaining() === 'None') {

        }*/

        $scope.indexerScript = scripts.indexerScript.bind(scripts);
        $scope.sources = $scope.game.getVideoSources();

        indexing.reset($scope.game, data.plays);
        tags.reset($scope.tagset);
        event.reset($scope.tagset);
        play.reset(gameId);
        play.clear();

        /* Bind keys. */


        var globalCallbacks = {
            'space': true,
            'left': true,
            'right': true,
            'enter': true,
            'esc': true
        };

        originalStopCallback = Mousetrap.stopCallback;

        Mousetrap.stopCallback = function(event, element, combo, sequence) {

            if (indexing.isIndexing) {

                if (globalCallbacks[combo] || globalCallbacks[sequence]) {
                    return false;
                }
            }

            return originalStopCallback(event, element, combo);
        };

        Mousetrap.bind('space', function() {

            $scope.$apply(function() {

                if (indexing.isReady) $scope.VideoPlayer.playPause();
            });

            return false;
        });

        Mousetrap.bind('left', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = getCurrentTime();
                    var time = currentTime - config.indexing.video.jump;
                    $scope.VideoPlayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bind('right', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = getCurrentTime();
                    var time = currentTime + config.indexing.video.jump;
                    $scope.VideoPlayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bind('enter', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) {

                    if (self.savable()) self.save();
                    else if (self.nextable()) self.next();
                }

                else if (indexing.isReady) self.index();
            });

            return false;
        });

        Mousetrap.bind('esc', function() {

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

            return this.nextable() && event.isEndEvent();
        };

        /**
         * Saves the current play.
         */
        this.save = function() {

            play.save();
            play.clear();

            this.next();
        };

        /**
         * Determines if the current indexing session can be advanced.
         * @returns {Boolean} true if the session can be advanced; false otherwise.
         */
        this.nextable = function() {

            /* If there are variables in the current event. */
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
            var tagId = event.current.tagId;

            /* Get the next set of tags based on the tag in the current event. */
            tags.current = $scope.tagset.getNextTags(tagId);

            /* Snap video back to time of current event. */
            $scope.VideoPlayer.seekTime(event.current.time);
            $scope.VideoPlayer.play();

            event.reset();
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
                event.reset();

                /* Drop back to tagging state. */
                indexing.showTags = true;
                indexing.showScript = false;
            }

            /* If the active variable is empty. */
            else if (!event.activeEventVariableValue()) {

                /* While the active variable is empty. */
                while (event.current.activeEventVariableIndex > 1 &&
                      !event.activeEventVariableValue()) {

                    /* Move back one variable. */
                    event.current.activeEventVariableIndex--;
                }

                /* Clear the value of the first variable is not empty. */
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
         * @param {Object} selectedEvent - the event to delete.
         */
        this.deleteEvent = function(selectedEvent) {

            /* Remove the event from the play. */
            event.delete(selectedEvent);

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

Indexing.directive('clearKeyListeners', [
    function directive() {

        var Mousetrap = window.Mousetrap;
        function link(scope, element, attributes) {
            element.on('focus', function() {
                Mousetrap.pause();
            });

            element.on('blur', function() {
                Mousetrap.unpause();
            });
        }

        var ClearKeyListeners = {
            restrict: 'A',
            link: link,
            controller: 'Indexing.Main.Controller'
        };

        return ClearKeyListeners;
    }
]);

