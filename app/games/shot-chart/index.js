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

    /* TODO: use arenaChart.get($stateParams.id) to get the arena Events*/
    $scope.arenaEvents = [
        {
            x: 0.6,
            y: 0.2,
            isMade: 0,
            period: '1'
        },
        {
            x: 0.65,
            y: 0.25,
            isMade: 0,
            period: '2'
        },
        {
            x: 0.75,
            y: 0.35,
            isMade: 0,
            period: '3'
        },
        {
            x: 0.80,
            y: 0.50,
            isMade: 1,
            period: '4'
        },
        {
            x: 0.85,
            y: 0.65,
            isMade: 1,
            period: 'OT'
        },
        {
            x: 0.9,
            y: 0.75,
            isMade: 1,
            period: '1'
        }
    ];

    // Determine arena type
    $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    $scope.homeTeam = homeTeam;
    $scope.opposingTeam = opposingTeam;
    $scope.filteredArenaEventCount = $scope.arenaEvents.length;

    /* Filters */

    const filtersDefault = {
        shots: {
            made: true,
            missed: true
        },
        period: {
            one: true,
            two: true,
            three: true,
            four: true,
            overtime: true
        }
    };

    //  make copy of default filters for 'applied' filters
    $scope.filters = angular.copy(filtersDefault);

    /* reset filters */
    $scope.resetFilters = function() {

        $scope.filters = angular.copy(filtersDefault);
    };

    $scope.arenaEventFilter = function() {

        $scope.filteredArenaEventCount = 0;

        return function filterArenaEventFilter(arenaEvent) {

            if (!angular.isUndefined(arenaEvent)) {

                /* shots */

                let inShotsFilter;

                if ($scope.filters.shots.made) {

                    if (arenaEvent.isMade) inShotsFilter = true;
                }

                if ($scope.filters.shots.missed) {

                    if (!arenaEvent.isMade) inShotsFilter = true;
                }


                /* periods */

                let inPeriodFilter;

                if ($scope.filters.period.one) {

                    if (arenaEvent.period === '1') inPeriodFilter = true;
                }

                if ($scope.filters.period.two) {

                    if (arenaEvent.period === '2') inPeriodFilter = true;
                }

                if ($scope.filters.period.three) {

                    if (arenaEvent.period === '3') inPeriodFilter = true;
                }

                if ($scope.filters.period.four) {

                    if (arenaEvent.period === '4') inPeriodFilter = true;
                }

                if ($scope.filters.period.overtime) {

                    if (arenaEvent.period === 'OT') inPeriodFilter = true;
                }

                if (inShotsFilter && inPeriodFilter) {

                    $scope.filteredArenaEventCount++;
                    return true;
                }
            }
        };
    };
}

GamesShotChart.controller('GamesShotChart.controller', GamesShotChartController);
