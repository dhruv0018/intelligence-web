
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexer Game page module.
 * @module Game
 */
var Game = angular.module('indexer-game', []);

/* Cache the template file */
Game.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexer-game.html', require('./indexer-game.html'));
    }
]);

/**
 * Indexer game page state router.
 * @module Game
 * @type {UI-Router}
 */
Game.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexer-game', {
                url: '/game/:id',
                parent: 'indexer',
                views: {
                    'main@root': {
                        templateUrl: 'indexer-game.html',
                        controller: 'indexer-game.Controller'
                    }
                },
                onExit: [
                    'AlertsService',
                    function(alerts) {

                        alerts.clear();
                    }
                ]
            });
    }
]);

/* File dependencies. */
require('./indexer-game-controller');
