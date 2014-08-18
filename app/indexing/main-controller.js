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
    'config', '$rootScope', '$scope', '$modal', 'BasicModals', '$stateParams', 'VG_EVENTS', 'SessionService', 'IndexingService', 'ScriptsService', 'TagsManager', 'PlaysManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data', 'VideoPlayerInstance',
    function controller(config, $rootScope, $scope, $modal, basicModal, $stateParams, VG_EVENTS, session, indexing, scripts, tags, playsManager, play, event, sidebar, data, videoplayerInstance) {

        var gameId = Number($stateParams.id);

        /* Scope */
        $scope.data = data;
        $scope.tags = tags;
        $scope.play = play;
        $scope.plays = playsManager.plays;
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

        $scope.indexerScript = scripts.indexerScript.bind(scripts);
        $scope.sources = $scope.game.getVideoSources();
        $scope.videoTitle = 'indexing';

        indexing.reset($scope.tagset, $scope.game, data.plays);

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

                    var currentTime = videoplayer.getCurrentTime();
                    var time = currentTime - config.indexing.video.jump;
                    videoplayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bind('right', function() {

            $scope.$apply(function() {

                if (indexing.isReady) {

                    var currentTime = videoplayer.getCurrentTime();
                    var time = currentTime + config.indexing.video.jump;
                    videoplayer.seekTime(time);
                }
            });

            return false;
        });

        Mousetrap.bind('enter', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) {

                    if (indexing.savable()) indexing.save();
                    else if (indexing.nextable()) indexing.next();
                    else indexing.step();
                }

                else if (indexing.isReady) indexing.index();
            });

            return false;
        });

        Mousetrap.bind('tab', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) indexing.step();
            });

            return false;
        });

        Mousetrap.bind('esc', function() {

            $scope.$apply(function() {

                if (indexing.isIndexing) indexing.back();
            });

            return false;
        });


        /* Controller methods */



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
    }
]);

