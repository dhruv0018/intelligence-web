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
    '$scope', '$modal', 'IndexingService', 'TagsManager', 'PlayManager', 'EventManager', 'Indexing.Sidebar',
    function controller($scope, $modal, indexing, tags, play, event, sidebar) {

        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
        $scope.buildScript = indexing.buildScript;

        /**
         * Select an event to use as the current event.
         */
        $scope.selectEvent = function(selectedPlay, selectedEvent) {

            indexing.eventSelected = true;
            indexing.isIndexing = true;
            indexing.showTags = false;
            indexing.showScript = true;

            /* Set the current time to the time from the selected event. */
            $scope.VideoPlayer.pause();
            $scope.VideoPlayer.seekTime(selectedEvent.time);

            /* Set the current play and event to match the selected event. */
            play.current = selectedPlay;
            event.current = selectedEvent;
        };
    }
]);

