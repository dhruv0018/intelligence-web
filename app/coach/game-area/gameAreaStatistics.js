require('./gameAreaLog.js');
require('./gameAreaHomeStats.js');
require('./gameAreaAwayStats.js');
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Statistics page module.
 * @module GameArea
 */
var GameAreaStatistics = angular.module('game-area-statistics', [
    'ui.router',
    'ui.bootstrap',
    'game-area-log',
    'game-area-homestats',
    'game-area-awaystats'
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

        $state.go('ga-log');

        $scope.statsSelector = 'ga-log';
    }
]);

