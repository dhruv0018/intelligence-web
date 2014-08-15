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
    '$scope', 'IndexingService', 'Indexing.Sidebar', 'GamesFactory',
    function controller($scope, indexing, sidebar, games) {

        var gameId = Number($stateParams.id);

        $scope.game = games.get(gameId);
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;

        $scope.$watch(function() {

            var lastPlay = $scope.indexing.plays[$scope.indexing.plays.length - 1];

            if (!lastPlay) return 0;

            return lastPlay.teamIndexedScore;

        }, function(teamIndexedScore) {

            $scope.game.indexedScore = teamIndexedScore;
        });

        $scope.$watch(function() {

            var lastPlay = $scope.indexing.plays[$scope.indexing.plays.length - 1];

            if (!lastPlay) return 0;

            return lastPlay.opposingIndexedScore;

        }, function(opposingIndexedScore) {

            $scope.game.opposingIndexedScore = opposingIndexedScore;
        });
    }
]);

