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
    let homeTeam = teams.get(game.teamId);
    let opposingTeam = teams.get(game.opposingTeamId);
    let league = leagues.get(homeTeam.leagueId);

    // Determine arena type
    $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    $scope.homeTeam = homeTeam;
    $scope.opposingTeam = opposingTeam;


    // $scope.arenaEvents = [
    //     {
    //         x: 0.32,
    //         y: 0.5
    //     },
    //     {
    //         x: 0.01,
    //         y: 0.25
    //     },
    //     {
    //         x: 0.22,
    //         y: 0.85
    //     },
    //     {
    //         x: 0.95,
    //         y: 0.12
    //     },
    //     {
    //         x: 0.432,
    //         y: 0.35
    //     },
    //     {
    //         x: 0.62,
    //         y: 0.56
    //     }
    // ];
}

GamesShotChart.controller('GamesShotChart.controller', GamesShotChartController);
