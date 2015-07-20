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
                    controller: 'GamesArenaChart.controller',
                    controllerAs: 'gamesArenaChart'
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
    'CustomtagsFactory',
    'SessionService',
    'PlayersFactory',
    'GamesFactory',
    '$stateParams',
    '$q'
];

function GamesArenaChartData (
    customtags,
    session,
    players,
    games,
    $stateParams,
    $q
) {

    let gameId = Number($stateParams.id);

    return games.load(gameId).then(function() {

        let game = games.get(gameId);
        let teamId = session.getCurrentTeamId();

        let Data = {
            playersByRosters: players.load({
                'rosterId[]': [
                    game.getRoster(game.teamId).id,
                    game.getRoster(game.opposingTeamId).id
                ]
            }),
            playersByGame: players.load({gameId}),
            arenaEvents: game.retrieveArenaEvents(),
            customtags: customtags.load({teamId})
        };

        return $q.all(Data);
    });
}


/* ArenaChart Controller */

GamesArenaChartController.$inject = [
    'EventEmitter',
    'EVENT',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    '$stateParams',
    '$filter',
    '$scope'
];

function GamesArenaChartController(
    eventEmitter,
    EVENT,
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
    let arenaEvents = game.getArenaEvents();

    // Determine arena type
    this.arenaType = ARENA_TYPES[league.arenaId].type;
    this.arenaEvents = arenaEvents;

    /* reset filters */
    this.resetFilters = () => eventEmitter.emit(EVENT.ARENA_CHART.FILTERS.RESET);
}

GamesArenaChart.controller('GamesArenaChart.controller', GamesArenaChartController);
