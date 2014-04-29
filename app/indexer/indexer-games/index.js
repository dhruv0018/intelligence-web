/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexer Games module.
 * @module Games
 */
var Games = angular.module('indexer-games', []);

/* Cache the template file */
Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexer-games.html', require('./indexer-games.html'));
    }
]);

/**
 * Games page state router.
 * @module Games
 * @type {UI-Router}
 */
Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexer-games', {
                url: '/games',
                parent: 'indexer',
                views: {
                    'main@root': {
                        templateUrl: 'indexer-games.html',
                        controller: 'indexer-games.Controller'
                    }
                }
            });
    }
]);

/**
 * Games controller.
 * @module Games
 * @name Controller
 * @type {Controller}
 */
Games.controller('indexer-games.Controller', [
    '$scope', '$state', '$localStorage', 'GAME_TYPES', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory',
    function controller($scope, $state, $localStorage, GAME_TYPES, teams, leagues, games) {

    }
]);
