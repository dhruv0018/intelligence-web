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
    '$scope', 'IndexingService', 'PlayManager', 'EventManager', 'Indexing.Sidebar', 'Indexing.Data', 'VideoPlayerInstance',
    function controller($scope, indexing, play, event, sidebar, data, VideoPlayer) {

        $scope.data = data;
        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
    }
]);

