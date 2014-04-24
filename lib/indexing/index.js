/* Component dependencies */
require('item');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing', [
    'ui.router',
    'ui.bootstrap',
    'ui.showhide',
    'Item',
    'Event',
    'Events',
    'Play',
    'Plays'
]);

/* Cache the template file */
Indexing.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/template.html', require('./template.html'));
        $templateCache.put('indexing/header.html', require('./header.html'));
        $templateCache.put('indexing/sidebar-notes.html', require('./sidebar-notes.html'));
        $templateCache.put('indexing/sidebar-playlist.html', require('./sidebar-playlist.html'));
        $templateCache.put('indexing/modal-delete-play.html', require('./modal-delete-play.html'));
        $templateCache.put('indexing/modal-send-to-team.html', require('./modal-send-to-team.html'));
        $templateCache.put('indexing/modal-add-indexer-note.html', require('./modal-add-indexer-note.html'));
    }
]);

/**
 * Indexing page state router.
 * @module Indexing
 * @type {UI-Router}
 */
Indexing.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexing', {
                url: '/indexing/:id',
                parent: 'root',
                views: {
                    'header@root': {
                        templateUrl: 'indexing/header.html',
                        controller: 'Indexing.Header.Controller'
                    },
                    'main@root': {
                        templateUrl: 'indexing/template.html',
                        controller: 'Indexing.Main.Controller',
                        controllerAs: 'main'
                    },
                    'sidebar-notes@indexing': {
                        templateUrl: 'indexing/sidebar-notes.html',
                        controller: 'Indexing.Sidebar.Notes.Controller'
                    },
                    'sidebar-playlist@indexing': {
                        templateUrl: 'indexing/sidebar-playlist.html',
                        controller: 'Indexing.Sidebar.Playlist.Controller'
                    }
                },
                resolve: {
                    IndexingService: [
                        '$stateParams', 'IndexingService',
                        function($stateParams, indexing) {

                            var gameId = $stateParams.id;

                            return indexing.init(gameId);
                        }
                    ]
                },
                onEnter: [
                    '$state', '$stateParams', 'SessionService', 'IndexingService',
                    function($state, $stateParams, session, indexing) {

                        var userId = session.currentUser.id;

                        if (!indexing.game.isAssignedToUser(userId)) {

                            $state.go('401');
                        }
                    }
                ],
                onExit: [
                    'AlertsService',
                    function(alerts) {

                        alerts.clear();

                        Mousetrap.unbind('space');
                        Mousetrap.unbind('left');
                        Mousetrap.unbind('right');
                        Mousetrap.unbind('enter');
                        Mousetrap.unbind('esc');
                    }
                ]
            });
    }
]);

/**
 * Sidebar toggle values
 * @module Indexing
 * @name Sidebar
 * @type {Value}
 */
Indexing.value('Indexing.Sidebar', {

    notes: false,
    playlist: true
});

/* File dependencies. */
require('./filters');
require('./tags-service');
require('./play-service');
require('./event-service');
require('./header-controller');
require('./main-controller');
require('./sidebar-notes-controller');
require('./sidebar-playlist-controller');
require('./modal-delete-play-controller');
require('./modal-send-to-team-controller');
require('./modal-add-indexer-note-controller');

