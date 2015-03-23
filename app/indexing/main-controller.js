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
    'ScriptsService',
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
    'PlayersFactory',
    function controller(config, EVENT_MAP, $rootScope, $scope, $modal, basicModal, $stateParams, videoPlayerEventEmitter,
                        session, indexing, scripts, tags, playsManager, play, event, sidebar, data, leagues, tagsets,
                        teams, games, plays, videoPlayer, players) {

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

        $scope.playerList = angular.extend({}, $scope.game.rosters[$scope.game.teamId].playerInfo, $scope.game.rosters[$scope.game.opposingTeamId].playerInfo);
        //parsing player dropdown ui
        Object.keys($scope.playerList).forEach(function(playerId) {
            var player = players.get(playerId);
            var playerInfo = $scope.playerList[playerId];
            playerInfo.playerId = parseInt(playerId);
            playerInfo.jerseyNumber = (playerInfo.jerseyNumber.length === 0) ? 'UN' : parseInt(playerInfo.jerseyNumber, 10);
            playerInfo.primaryJerseyColor = $scope.game.rosters[$scope.game.teamId].playerInfo[playerId] ? $scope.game.primaryJerseyColor : $scope.game.opposingPrimaryJerseyColor;
            playerInfo.firstName = player.firstName;
            playerInfo.lastName = player.lastName;
        });

        var playsList = plays.getList({ gameId: gameId });

        indexing.reset($scope.tagset, $scope.game, playsList);

        var indexingElement = document.getElementsByClassName('indexing')[0];

        videoPlayerEventEmitter.on('fullscreen', onFullScreen);

        $scope.$on('$destroy', onDestroy);

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

