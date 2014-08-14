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
    'config', '$rootScope', '$scope', '$modal', 'BasicModals', '$stateParams', 'VG_EVENTS', 'SessionService', 'IndexingService', 'ScriptsService', 'TagsManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data', 'VideoPlayerInstance',
    function controller(config, $rootScope, $scope, $modal, basicModal, $stateParams, VG_EVENTS, session, indexing, scripts, tags, play, event, sidebar, data, videoplayerInstance) {

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

        var videoplayer;
        videoplayerInstance.then(function(vp) {
            vp.videoElement.one('canplay', function() {
                videoplayer = vp;
                indexing.isReady = true;
            });
        });

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
        $scope.videoTitle = 'indexing';

        indexing.reset($scope.game, data.plays);
        tags.reset($scope.tagset);
        event.reset($scope.tagset);
        play.reset($scope.tagset, gameId);
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

            $scope.$apply(function() {

                if (indexing.isIndexing) {

                    if (globalCallbacks[combo] || globalCallbacks[sequence]) {
                        return false;
                    }
                }

                return originalStopCallback(event, element, combo);
            });
        };

        Mousetrap.bind('space', function() {

            $scope.$apply(function() {

                if (indexing.isReady) videoplayer.playPause();
            });

            return false;
        });

        Mousetrap.bind('left', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = getCurrentTime();
                    var time = currentTime - config.indexing.video.jump;
                    videoplayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bind('right', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = getCurrentTime();
                    var time = currentTime + config.indexing.video.jump;
                    videoplayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bind('enter', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) {

                    if (self.savable()) self.save();
                    else if (self.nextable()) self.next();
                    else self.step();
                }

                else if (indexing.isReady) self.index();
            });

            return false;
        });

        Mousetrap.bind('tab', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) self.step();
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
            videoplayer.pause();
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
         * Steps the current variable.
         */
        this.step = function() {

            /* Move to the next event variable. */
            event.current.activeEventVariableIndex++;

            /* If the variable is filled in with an optional value. */
            if (event.activeEventVariableValue() === null) {

                /* Clear the variable value. */
                event.clearActiveEventVariableValue();
            }
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

            indexing.showTags = false;
            indexing.showScript = false;
            indexing.isIndexing = false;
            indexing.eventSelected = false;

            /* Snap video back to time of current event. */
            videoplayer.seekTime(event.current.time);
            videoplayer.play();

            play.save(play.current);
            play.clear();
            tags.reset();
            event.reset();
        };

        /**
         * Determines if the current indexing session can be advanced.
         * @returns {Boolean} true if the session can be advanced; false otherwise.
         */
        this.nextable = function() {

            /* If not indexing or the tags are showing. */
            if (!indexing.isIndexing || indexing.showTags) return false;

            /* If there are variables in the current event. */
            else if (event.hasVariables()) {

                /* Make sure all of the variables have values. */
                return event.allEventVariablesHaveValues();
            }

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
            videoplayer.seekTime(event.current.time);
            videoplayer.play();
        };

        /**
         * Moves backwards through previously indexed events and plays.
         */
        this.back = function() {

            /* If editing an event. */
            if (indexing.eventSelected) {

                indexing.eventSelected = false;
                indexing.showTags = true;
                indexing.showScript = false;
                indexing.isIndexing = true;
                videoplayer.play();
            }

            /* If the tags are showing. */
            else if (indexing.showTags) {

                /* Drop back into not indexing state. */
                indexing.showTags = false;
                indexing.showScript = false;
                indexing.isIndexing = false;
                videoplayer.play();
            }

            /* If the event doesn't have variables of If the first variable is empty. */
            else if (!event.hasVariables() ||
                     (event.current.activeEventVariableIndex === 1 &&
                     !event.activeEventVariableValue())) {

                /* Remove the event from the play. */
                play.removeEvent(event.current);

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

            indexing.showTags = true;
            indexing.showScript = false;
            indexing.eventSelected = false;
            indexing.isIndexing = false;

            /* Delete the selected event. */
            event.delete(selectedEvent);

            /* Save play. */
            play.save();

            /* Clear the current play. */
            play.clear();
        };


        /* Listeners for video player events */


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

            return videoplayer.videoElement[0].currentTime;
        };

        /**
         * Sets the current time in the video. Seeks video to that time.
         * @param {Integer} time - time to seek video to.
         */
        var setCurrentTime = function(time) {

            videoplayer.seekTime(time);
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

