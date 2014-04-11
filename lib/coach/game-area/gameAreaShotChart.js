
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Film page module.
 * @module GameArea
 */
var GameAreaShotChart = angular.module('game-area-shot-chart', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaShotChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaShotChart.html', require('./gameAreaShotChart.html'));
    }
]);

GameAreaShotChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-shot-chart',
            url: '',
            parent: 'game-area',
            views: {
                'content@game-area': {
                    templateUrl: 'coach/game-area/gameAreaShotChart.html',
                    controller: 'GameAreaShotChartController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaShotChart.controller('GameAreaShotChartController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'GAME_STATUS_IDS',
    function controller($scope, $state, $stateParams, games, GAME_STATUS_IDS) {



    }
]);
