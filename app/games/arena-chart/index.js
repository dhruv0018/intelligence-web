/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesArenaChart = angular.module('Games.ArenaChart', []);

GamesArenaChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/arena-chart.html', require('./template.html'));
    }
]);

GamesArenaChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var arenaChart = {
            name: 'Games.ArenaChart',
            url: '/arena-chart',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/arena-chart.html',
                    controller: 'GamesArenaChart.controller'
                }
            },
            resolve: {
                'Games.ArenaChart.Data': GamesArenaChartData
            }
        };

        $stateProvider.state(arenaChart);

    }
]);

/* ArenaChart Data Resolve */

GamesArenaChartData.$inject = [
    'PlayersFactory',
    'GamesFactory',
    '$stateParams',
    '$q'
];

function GamesArenaChartData (
    players,
    games,
    $stateParams,
    $q
) {

    let gameId = Number($stateParams.id);

    return games.load(gameId).then(function() {

        let game = games.get(gameId);

        let Data = {
            players: players.load({
                'rosterId[]': [
                    game.getRoster(game.teamId).id,
                    game.getRoster(game.opposingTeamId).id
                ]
            })
        };

        return $q.all(Data);
    });
}


/* ArenaChart Controller */

GamesArenaChartController.$inject = [
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    '$stateParams',
    '$filter',
    '$scope'
];

function GamesArenaChartController(
    ARENA_TYPES,
    games,
    teams,
    leagues,
    $stateParams,
    $filter,
    $scope
) {

    let game = games.get($stateParams.id);
    let team = teams.get(game.teamId);
    let opposingTeam = teams.get(game.opposingTeamId);
    let league = leagues.get(team.leagueId);

    /* TODO: use arenaChart.get($stateParams.id) to get the arena Events*/
    let arenaEvents = [
        {
            x: 0.6,
            y: 0.2,
            isMade: 0,
            period: '1',
            playerId: 66791
        },
        {
            x: 0.65,
            y: 0.25,
            isMade: 0,
            period: '2',
            playerId: 66792
        },
        {
            x: 0.75,
            y: 0.35,
            isMade: 0,
            period: '3',
            playerId: 66793
        },
        {
            x: 0.80,
            y: 0.50,
            isMade: 1,
            period: '4',
            playerId: 66794
        },
        {
            x: 0.85,
            y: 0.65,
            isMade: 1,
            period: 'OT',
            playerId: 66795
        },
        {
            x: 0.9,
            y: 0.75,
            isMade: 1,
            period: '1',
            playerId: 66796
        },
        {
            x: 0.1,
            y: 0.2,
            isMade: 0,
            period: '1',
            playerId: 66813
        },
        {
            x: 0.3,
            y: 0.25,
            isMade: 0,
            period: '2',
            playerId: 66814
        },
        {
            x: 0.25,
            y: 0.35,
            isMade: 0,
            period: '3',
            playerId: 66815
        },
        {
            x: 0.13,
            y: 0.50,
            isMade: 1,
            period: '4',
            playerId: 66816
        },
        {
            x: 0.45,
            y: 0.65,
            isMade: 1,
            period: 'OT',
            playerId: 66817
        },
        {
            x: 0.18,
            y: 0.75,
            isMade: 1,
            period: '1',
            playerId: 66818
        }
    ];

    // Determine arena type
    try {
        $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    } catch (error) {
        throw new Error(error);
    }

    $scope.game = game;
    $scope.team = team;
    $scope.opposingTeam = opposingTeam;
    $scope.arenaEvents = arenaEvents;
    $scope.filteredArenaEvents = [];

    /* Filters */

    const filtersDefault = {
        shots: {
            made: false,
            missed: false
        },
        period: {
            one: false,
            two: false,
            three: false,
            four: false,
            overtime: false
        },
        teamPlayersIds: [],
        opposingTeamPlayersIds: []
    };

    //  make copy of default filters for 'applied' filters
    $scope.filters = angular.copy(filtersDefault);

    /* reset filters */
    $scope.resetFilters = function() {

        $scope.filters = angular.copy(filtersDefault);
    };

    let removeFiltersWatch = $scope.$watch('filters', filtersWatch, true);
    $scope.$on('$destroy', onDestroy);

    /* Filter arenaEvents in this watch to have access to the filtered results in this scope */
    function filtersWatch(newFilters) {

        $scope.filteredArenaEvents = $filter('arenaEvents')($scope.arenaEvents, newFilters);
    }

    function onDestroy() {

        removeFiltersWatch();
    }
}

GamesArenaChart.controller('GamesArenaChart.controller', GamesArenaChartController);
