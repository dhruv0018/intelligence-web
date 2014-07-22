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

        //TODO: get this data from server
        console.log('data', data, $scope);

        $scope.gameLogTable = data.stats.gameLog;
        $scope.homeTeamStats = data.stats.homeTeamStats;
        $scope.awayTeamStats = data.stats.awayTeamStats;

        /*$scope.gameLogTable = {"header":[{"label":"","children":[{"label":""}]},{"label":"Serves","children":[{"label":"Started"},{"label":"Sets"},{"label":"Attempts"},{"label":"Aces"},{"label":"Errors"}]},{"label":"Attacks","children":[{"label":"Attacks"},{"label":"Kills"},{"label":"Errors"},{"label":"Points"}]},{"label":"Service Receptions","children":[{"label":"Attacks"},{"label":"Kills"},{"label":"Errors"},{"label":"Points"}]},{"label":"Blocks","children":[{"label":"Recep."},{"label":"Errors"}]},{"label":"Digs","children":[{"label":"Digs"},{"label":"Errors"}]},{"label":"Errors","children":[{"label":"Total Errors"}]}],"body":[{"label":"1","children":[[{"label":"Tigers","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}],[{"label":"Bears","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]]},{"label":"2","children":[{"label":"Tigers","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"3","children":[{"label":"Tigers","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"4","children":[{"label":"Tigers","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"Total","children":[{"label":"Tigers","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"25"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]}]};
        $scope.gameLogTable2 = {"header":[{"label":"","children":[{"label":""}]},{"label":"Serves","children":[{"label":"Started"},{"label":"Sets"},{"label":"Attempts"},{"label":"Aces"},{"label":"Errors"}]},{"label":"Attacks","children":[{"label":"Attacks"},{"label":"Kills"},{"label":"Errors"},{"label":"Points"}]},{"label":"Service Receptions","children":[{"label":"Attacks"},{"label":"Kills"},{"label":"Errors"},{"label":"Points"}]},{"label":"Blocks","children":[{"label":"Recep."},{"label":"Errors"}]},{"label":"Digs","children":[{"label":"Digs"},{"label":"Errors"}]},{"label":"Errors","children":[{"label":"Total Errors"}]}],"body":[{"label":"1","children":[{"label":"Tigers","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"2","children":[{"label":"Tigers","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"3","children":[{"label":"Tigers","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"4","children":[{"label":"Tigers","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"Total","children":[{"label":"Tigers","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"26"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]}]};
        $scope.gameLogTable3 = {"header":[{"label":"","children":[{"label":""}]},{"label":"Serves","children":[{"label":"Started"},{"label":"Sets"},{"label":"Attempts"},{"label":"Aces"},{"label":"Errors"}]},{"label":"Attacks","children":[{"label":"Attacks"},{"label":"Kills"},{"label":"Errors"},{"label":"Points"}]},{"label":"Service Receptions","children":[{"label":"Attacks"},{"label":"Kills"},{"label":"Errors"},{"label":"Points"}]},{"label":"Blocks","children":[{"label":"Recep."},{"label":"Errors"}]},{"label":"Digs","children":[{"label":"Digs"},{"label":"Errors"}]},{"label":"Errors","children":[{"label":"Total Errors"}]}],"body":[{"label":"1","children":[{"label":"Tigers","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"2","children":[{"label":"Tigers","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"3","children":[{"label":"Tigers","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"4","children":[{"label":"Tigers","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]},{"label":"Total","children":[{"label":"Tigers","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]},{"label":"Bears","children":[[{"label":"27"},{"label":"--"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"},{"label":"##"}]]}]}]};*/

        $scope.statsSelector = 'ga-log';
    }
]);

