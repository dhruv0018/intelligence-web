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
            }),
            arenaEvents: game.getArenaEvents().$promise.then(function(arenaEvents) {
                return arenaEvents;
            })
        };

        return $q.all(Data);
    });
}


/* ArenaChart Controller */

GamesArenaChartController.$inject = [
    'Games.ArenaChart.Data',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    '$stateParams',
    '$filter',
    '$scope'
];

function GamesArenaChartController(
    data,
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
    let league = leagues.get(team.leagueId);
    let arenaEvents = data.arenaEvents;

    // Determine arena type
    try {
        $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    } catch (error) {
        throw new Error(error);
    }

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
