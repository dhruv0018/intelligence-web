/* Fetch angular from the browser scope */
const angular = window.angular;

const GamesArenaChart = angular.module('Games.ArenaChart', []);

import template from './template.html';

GamesArenaChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const arenaChart = {
            name: 'Games.ArenaChart',
            url: '/arena-chart',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    template
                }
            },
            resolve: {
                'Games.ArenaChart.Data': [
                    '$q', '$stateParams', 'ArenaChartDataDependencies',
                    function resolveGamesArenaChartState($q, $stateParams, ArenaChartData) {

                        let gameId = Number($stateParams.id);
                        let data = new ArenaChartData(gameId);

                        return $q.all(data);
                    }
                ]
            }
        };

        $stateProvider.state(arenaChart);
    }
]);

export default GamesArenaChart;
