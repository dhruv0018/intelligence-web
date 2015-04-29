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
    }
]);
