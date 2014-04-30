/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Home Stats page module.
 * @module GameArea
 */
var GameAreaHomeStats = angular.module('game-area-homestats', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaHomeStats.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaHomeStats.html', require('./gameAreaHomeStats.html'));
    }
]);

GameAreaHomeStats.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-homestats',
            url: '/homestats',
            parent: 'ga-statistics',
            views: {
                'content@ga-statistics': {
                    templateUrl: 'coach/game-area/gameAreaHomeStats.html',
                    controller: 'GameAreaHomeStatsController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaHomeStats.controller('GameAreaHomeStatsController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {


    }
]);