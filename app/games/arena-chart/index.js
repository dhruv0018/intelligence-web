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
            playerId: 75066,
            teamId: 13305,
            customTagIds: [8]
        },
        {
            x: 0.65,
            y: 0.25,
            isMade: 0,
            period: '2',
            playerId: 75067,
            teamId: 13305,
            customTagIds: [8]
        },
        {
            x: 0.75,
            y: 0.35,
            isMade: 0,
            period: '3',
            playerId: 75070,
            teamId: 13305
        },
        {
            x: 0.80,
            y: 0.50,
            isMade: 1,
            period: '4',
            playerId: 75076,
            teamId: 13305
        },
        {
            x: 0.85,
            y: 0.65,
            isMade: 1,
            period: 'OT',
            playerId: 75071,
            teamId: 13305,
            customTagIds: [8]
        },
        {
            x: 0.9,
            y: 0.75,
            isMade: 1,
            period: '1',
            playerId: 75047,
            teamId: 13305
        },
        {
            x: 0.1,
            y: 0.2,
            isMade: 0,
            period: '1',
            playerId: 75048,
            teamId: 13304
        },
        {
            x: 0.3,
            y: 0.25,
            isMade: 0,
            period: '2',
            playerId: 75053,
            teamId: 13304
        },
        {
            x: 0.25,
            y: 0.35,
            isMade: 0,
            period: '3',
            playerId: 75059,
            teamId: 13304
        },
        {
            x: 0.13,
            y: 0.50,
            isMade: 1,
            period: '4',
            playerId: 75062,
            teamId: 13304
        },
        {
            x: 0.45,
            y: 0.65,
            isMade: 1,
            period: 'OT',
            playerId: 75062,
            teamId: 13304
        },
        {
            x: 0.18,
            y: 0.75,
            isMade: 1,
            period: '1',
            playerId: 75063,
            teamId: 13304
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

    /* reset filters */
    $scope.resetFilters = function() {

        $scope.$broadcast('arena-chart-filters:reset');
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
