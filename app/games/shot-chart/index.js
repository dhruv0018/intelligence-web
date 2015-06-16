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
            },
            resolve: {
                'Games.ShotChart.Data': GamesShotChartData
            }
        };

        $stateProvider.state(shotChart);

    }
]);

/* ShotChart Data Resolve */

GamesShotChartData.$inject = [
    'GamesFactory',
    '$stateParams',
    '$q'
];

function GamesShotChartData (
    games,
    $stateparams,
    $q
) {

}


/* ShotChart Controller */

GamesShotChartController.$inject = [
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    '$stateParams',
    '$scope'
];

function GamesShotChartController(
    ARENA_TYPES,
    games,
    teams,
    leagues,
    $stateParams,
    $scope
) {

    let game = games.get($stateParams.id);
    let team = teams.get(game.teamId);
    let league = leagues.get(team.leagueId);

    // Determine arena type
    $scope.arenaType = ARENA_TYPES[league.arenaId].type;
}

GamesShotChart.controller('GamesShotChart.controller', GamesShotChartController);
