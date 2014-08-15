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
    '$scope', '$stateParams', 'Indexing.Sidebar', 'GamesFactory', 'PlaysManager',
    function controller($scope, $stateParams, sidebar, games, playsManager) {

        var gameId = Number($stateParams.id);

        $scope.sidebar = sidebar;
        $scope.game = games.get(gameId);
        $scope.plays = playsManager.plays;

        $scope.$watch(function() {

            var lastPlay = playsManager.getLastPlay();

            if (!lastPlay) return 0;

            return lastPlay.teamIndexedScore;

        }, function(teamIndexedScore) {

            $scope.game.indexedScore = teamIndexedScore;
        });

        $scope.$watch(function() {

            var lastPlay = playsManager.getLastPlay();

            if (!lastPlay) return 0;

            return lastPlay.opposingIndexedScore;

        }, function(opposingIndexedScore) {

            $scope.game.opposingIndexedScore = opposingIndexedScore;
        });
    }
]);

