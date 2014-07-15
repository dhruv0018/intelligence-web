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
    '$scope', 'IndexingService', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data',
    function controller($scope, indexing, play, event, sidebar, data) {

        $scope.data = data;
        $scope.game = data.game;
        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
    }
]);

