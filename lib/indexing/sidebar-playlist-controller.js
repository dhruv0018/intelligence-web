/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('indexing');

/**
 * Indexing playlist sidebar controller.
 * @module Indexing
 * @name indexing.Sidebar.Playlist.Controller
 * @type {Controller}
 */
Indexing.controller('indexing.Sidebar.Playlist.Controller', [
    '$scope', '$modal', 'IndexingService', 'indexing.TagsService', 'indexing.PlayService', 'indexing.EventService', 'indexing.Sidebar',
    function controller($scope, $modal, indexing, tags, play, event, sidebar) {

        $scope.play = play;
        $scope.event = event;
        $scope.sidebar = sidebar;
        $scope.indexing = indexing;
        $scope.buildScript = indexing.buildScript;

        /**
         * Select an event to use as the current event.
         */
        $scope.selectEvent = function(play, event) {

            $scope.isIndexing = true;

            /* Set the current time to the time from the selected event. */
            $scope.VideoPlayer.pause();
            $scope.VideoPlayer.seekTime(event.time);

            /* Clear current tags. */
            tags.clear();

            /* Set the current play and event to match the selected event. */
            play.current = play;
            event.current = event;
        };

        /**
         * Deletes a play.
         */
        $scope.deletePlay = function(selectedPlay) {

            $modal.open({

                controller: 'Indexing.Modal.DeletePlay.Controller',
                templateUrl: 'indexing/modal-delete-play.html'

            }).result.then(function() {

                play.remove(selectedPlay);
            });
        };
    }
]);

