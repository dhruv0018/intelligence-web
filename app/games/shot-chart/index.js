/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesShotChart = angular.module('Games.ShotChart', []);

GamesShotChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/shot-chart.html', require('./template.html'));
    }
]);

GamesShotChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var shotChart = {
            name: 'Games.ShotChart',
            url: '/shot-chart',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/shot-chart.html',
                    controller: 'GamesShotChart.controller'
                }
            }
        };

        $stateProvider.state(shotChart);

    }
]);

GamesShotChart.controller('GamesShotChart.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'GAME_STATUS_IDS',
    function controller($scope, $state, $stateParams, games, GAME_STATUS_IDS) {



    }
]);
