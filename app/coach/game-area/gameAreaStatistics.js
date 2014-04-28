/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Statistics page module.
 * @module GameArea
 */
var GameAreaStatistics = angular.module('game-area-statistics', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaStatistics.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaStatistics.html', require('./gameAreaStatistics.html'));
    }
]);

GameAreaStatistics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-statistics',
            url: '/statistics',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaStatistics.html',
                    controller: 'GameAreaStatisticsController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaStatistics.controller('GameAreaStatisticsController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {


    }
]);