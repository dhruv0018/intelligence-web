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

        $scope.game = data.game;
        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;

        $scope.$watch(function() {

            var lastPlay = $scope.indexing.plays[$scope.indexing.plays.length - 1];

            if (!lastPlay) return 0;

            return lastPlay.teamIndexedScore;

        }, function(teamIndexedScore) {

            $scope.game.teamIndexedScore = teamIndexedScore;
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

