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
    'config', '$rootScope', '$scope', '$modal', 'BasicModals', '$stateParams', 'VG_EVENTS', 'SessionService', 'IndexingService', 'ScriptsService', 'TagsManager', 'PlaysManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data', 'VideoPlayerInstance', 'LeaguesFactory', 'TagsetsFactory', 'TeamsFactory', 'GamesFactory', 'PlaysFactory',
    function controller(config, $rootScope, $scope, $modal, basicModal, $stateParams, VG_EVENTS, session, indexing, scripts, tags, playsManager, play, event, sidebar, data, videoplayerInstance, leagues, tagsets, teams, games, plays) {

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
        play.videoTitle = 'indexing'; //playManager.videoTitle

        var plays = plays.getList({ gameId: gameId });

        indexing.reset($scope.tagset, $scope.game, plays);

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

