/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Indexing playlist sidebar controller.
 * @module Indexing
 * @name Sidebar.Playlist.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Sidebar.Playlist.Controller', [
    '$scope', '$stateParams', 'Indexing.Sidebar', 'GamesFactory', 'PlaysManager', 'Indexing.Data',
    function controller($scope, $stateParams, sidebar, games, playsManager, data) {

        var gameId = Number($stateParams.id);

        $scope.sidebar = sidebar;
        $scope.game = games.get(gameId);
        $scope.plays = playsManager.plays;
        $scope.teamPlayers = data.teamPlayers;
        $scope.opposingTeamPlayers = data.opposingTeamPlayers;

        /* TODO: Think of a better way to do this? */

        const removeLastPlayWatch = $scope.$watchCollection(watchLastPlay, onLastPlayChange);

        function watchLastPlay() {

            let lastPlay = playsManager.getLastPlay();

            if (!lastPlay) return undefined;

            let playData = {

                period: lastPlay.period,
                indexedScore: lastPlay.indexedScore,
                opposingIndexedScore: lastPlay.opposingIndexedScore
            };

            return playData;
        }

        function onLastPlayChange (playData) {

            if (!playData) return;

            $scope.game.currentPeriod = playData.period;
            $scope.game.indexedScore = playData.indexedScore;
            $scope.game.opposingIndexedScore = playData.opposingIndexedScore;
        }

        $scope.$on('$destroy', () => removeLastPlayWatch());
    }
]);
