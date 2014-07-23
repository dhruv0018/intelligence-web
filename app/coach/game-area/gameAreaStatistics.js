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
            },
            resolve: {
                'GameAreaStatistics.Data': [
                    '$q', 'GameAreaStatistics.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaStatistics.service('GameAreaStatistics.Data.Dependencies', [
    '$stateParams', 'GamesFactory',
    function($stateParams, games) {
        var Data = {};

        Data.stats = games.getStats($stateParams.id);

        return Data;
    }
]);

GameAreaStatistics.controller('GameAreaStatisticsController', [
    '$scope', '$state', '$stateParams', 'GameAreaStatistics.Data',
    function controller($scope, $state, $stateParams, data) {

        $scope.gameLogTable = data.stats.gameLog;
        $scope.homeTeamStats = data.stats.homeTeamStats;
        $scope.awayTeamStats = data.stats.awayTeamStats;

        $scope.statsSelector = 'ga-log';
    }
]);

