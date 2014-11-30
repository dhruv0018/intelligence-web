/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Shot Chart page module.
 * @module GameArea
 */
var GamesShotChart = angular.module('Games.ShotChart', [
    'ui.router',
    'ui.bootstrap'
]);

GamesShotChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaShotChart.html', require('./template.html'));
    }
]);

GamesShotChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Games.ShotChart',
            url: '/shot-chart',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'coach/game-area/gameAreaShotChart.html',
                    controller: 'GamesShotChartController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GamesShotChart.controller('GamesShotChartController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'GAME_STATUS_IDS',
    function controller($scope, $state, $stateParams, games, GAME_STATUS_IDS) {



    }
]);
