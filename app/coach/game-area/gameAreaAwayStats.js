/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Away Stats page module.
 * @module GameArea
 */
var GameAreaAwayStats = angular.module('game-area-awaystats', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaAwayStats.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaAwayStats.html', require('./gameAreaAwayStats.html'));
    }
]);

GameAreaAwayStats.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-awaystats',
            url: '/awaystats',
            parent: 'ga-statistics',
            views: {
                'content@ga-statistics': {
                    templateUrl: 'coach/game-area/gameAreaAwayStats.html',
                    controller: 'GameAreaAwayStatsController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaAwayStats.controller('GameAreaAwayStatsController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {


    }
]);

