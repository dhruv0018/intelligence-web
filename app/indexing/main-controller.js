/* Fetch angular from the browser scope */
var angular = window.angular;

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
    'config',
    'EVENT_MAP',
    '$rootScope',
    '$scope',
    '$modal',
    'BasicModals',
    '$stateParams',
    'VideoPlayerEventEmitter',
    'SessionService',
    'IndexingService',
    'TagsManager',
    'PlaysManager',
    'PlayManager',
    'EventManager',
    'Indexing.Sidebar',
    'Indexing.Data',
    'LeaguesFactory',
    'TagsetsFactory',
    'TeamsFactory',
    'GamesFactory',
    'PlaysFactory',
    'VideoPlayer',
    function controller(config,
                        EVENT_MAP,
                        $rootScope,
                        $scope,
                        $modal,
                        basicModal,
                        $stateParams,
                        videoPlayerEventEmitter,
                        session,
                        indexing,
                        tags,
                        playsManager,
                        play,
                        event,
                        sidebar,
                        data,
                        leagues,
                        tagsets,
                        teams,
                        games,
                        plays,
                        videoPlayer) {

        var gameId = Number($stateParams.id);

        $scope.tags = tags;
        $scope.play = play;
        $scope.plays = playsManager.plays;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
        $scope.game = games.get(gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
        $scope.teamPlayers = data.teamPlayers;
        $scope.opposingTeamPlayers = data.opposingTeamPlayers;
        $scope.league = leagues.get($scope.team.leagueId);
        $scope.tagset = tagsets.get($scope.league.tagSetId);
        $scope.sources = $scope.game.getVideoSources();
        $scope.videoPlayer = videoPlayer;

        var playsList = plays.getList({ gameId: gameId });

        indexing.reset($scope.tagset, $scope.game, playsList);

        var indexingElement = document.getElementsByClassName('indexing')[0];

        videoPlayerEventEmitter.on('fullscreen', onFullScreen);

        $scope.$on('$destroy', onDestroy);

        /* TODO: Just temp until event entity has tag in it. */
        $scope.indexerScript = function(event) {

            var tagId = event.tagId;
            var tags = $scope.tagset.tags;
            var tag = tags[tagId];

            return tag.indexerScript;
        };

        /**
         * Change handler for video player fill screen changes.
         */
        function onFullScreen (isFullScreen) {

            indexingElement.classList.toggle('fullscreen', isFullScreen);
        }

        function onDestroy () {

            videoPlayerEventEmitter.removeListener('fullscreen', onFullScreen);
        }
    }
]);
