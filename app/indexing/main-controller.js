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
    'config', '$rootScope', '$scope', '$modal', 'BasicModals', '$stateParams', 'SessionService', 'IndexingService', 'ScriptsService', 'TagsManager', 'PlaysManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data', 'LeaguesFactory', 'TagsetsFactory', 'TeamsFactory', 'GamesFactory', 'PlaysFactory', 'VideoPlayer',
    function controller(config, $rootScope, $scope, $modal, basicModal, $stateParams, session, indexing, scripts, tags, playsManager, play, event, sidebar, data, leagues, tagsets, teams, games, plays, videoPlayer) {

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
        $scope.indexerScript = scripts.indexerScript.bind(scripts);
        $scope.sources = $scope.game.getVideoSources();
        $scope.videoPlayer = videoPlayer;

        var playsList = plays.getList({ gameId: gameId });

        indexing.reset($scope.tagset, $scope.game, playsList);

        var indexingElement = document.getElementsByClassName('indexing')[0];
        var videoPlayerElement = document.getElementsByTagName('videogular')[0];

        $scope.$on('$destroy', onDestroy);

        var removeVideoPlayerFullScreenWatch = $scope.$watch(videoPlayerFullScreenWatch, onFullScreenChange);

        /**
         * Watch for video player full screen changes.
         */
        function videoPlayerFullScreenWatch () {

            return videoPlayerElement.classList.contains('fullscreen');
        }

        /**
         * Change handler for video player fill screen changes.
         */
        function onFullScreenChange (isFullScreen) {

            indexingElement.classList.toggle('fullscreen', isFullScreen);
        }

        function onDestroy () {

            removeVideoPlayerFullScreenWatch();
        }
    }
]);

