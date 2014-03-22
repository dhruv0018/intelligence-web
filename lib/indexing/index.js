/* Component dependencies */
require('item');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('indexing', [
    'ui.router',
    'ui.bootstrap',
    'ui.showhide',
    'indexing.item'
]);

/* Cache the template file */
Indexing.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing.html', require('./indexing.html'));
        $templateCache.put('indexing-header.html', require('./indexing-header.html'));
        $templateCache.put('delete-play.html', require('./delete-play.html'));
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
                        templateUrl: 'indexing-header.html',
                        controller: 'indexing.Header.Controller'
                    },
                    'main@root': {
                        templateUrl: 'indexing.html',
                        controller: 'indexing.Main.Controller'
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
                }
            });
    }
]);

/* File dependencies. */
require('./indexing-controller');

