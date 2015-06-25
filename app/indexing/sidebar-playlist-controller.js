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

IndexingSidebarPlaylistController.$inject = [
    'CurrentEventBroker',
    '$scope',
    '$stateParams',
    'Indexing.Sidebar',
    'GamesFactory',
    'PlaysManager',
    'PlaylistEventEmitter',
    'IndexingService',
    'EVENT',
    'VideoPlayer'
];

function IndexingSidebarPlaylistController(
    currentEventBroker,
    $scope,
    $stateParams,
    sidebar,
    games,
    playsManager,
    playlistEventEmitter,
    indexing,
    EVENT,
    videoPlayer
) {

    var gameId = Number($stateParams.id);

    $scope.sidebar = sidebar;
    $scope.game = games.get(gameId);
    $scope.plays = playsManager.plays;

    currentEventBroker.retain();

    $scope.$on('$destroy', onDestroy);
    playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.SELECT, onEventSelect);

    function onEventSelect(event) {

        indexing.onEventSelect(event);
        videoPlayer.seekTime(event.time);
    }

    function onDestroy() {

        playlistEventEmitter.removeListener(EVENT.PLAYLIST.EVENT.SELECT, onEventSelect);
        currentEventBroker.resign();
    }
}

Indexing.controller('Indexing.Sidebar.Playlist.Controller', IndexingSidebarPlaylistController);
