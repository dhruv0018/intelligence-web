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
            players: players.load({
                'rosterId[]': [
                    game.getRoster(game.teamId).id,
                    game.getRoster(game.opposingTeamId).id
                ]
            }),
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
    'CustomtagsFactory',
    'PlayersFactory',
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
    customtags,
    players,
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
    let arenaEvents = game.getArenaEvents();
    let customTags = customtags.getList({teamId: team.id});

    let teamPlayersFilter = {rosterId: game.getRoster(game.teamId).id};
    let teamPlayerList = players.getList(teamPlayersFilter);

    let opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
    let opposingTeamPlayerList = players.getList(opposingTeamPlayersFilter);

    // Determine arena type
    this.arenaType = ARENA_TYPES[league.arenaId].type;
    this.arenaEvents = arenaEvents;

    /* Construct pills */

    const pills = [];

    teamPlayerList.forEach((player) => {
        let playerCopy = angular.copy(player);
        playerCopy.name = player.shortName;
        pills.push(playerCopy);
    });

    opposingTeamPlayerList.forEach((player) => {
        let playerCopy = angular.copy(player);
        playerCopy.name = player.shortName;
        pills.push(playerCopy);
    });

    customTags.forEach((tag) => {
        pills.push(tag);
    });

    this.activePills = pills;

    /* reset filters */
    this.resetFilters = () => eventEmitter.emit(EVENT.ARENA_CHART.FILTERS.RESET);

    /* Filter arenaEvents in this watch to have access to the filtered results in this scope */
    $scope.$watch(
        () => {

            return this.filters;

        },
        (newFilters) => {

            if (!newFilters) return;

            /* Filter arena events */
            this.filteredArenaEvents = $filter('arenaEvents')(this.arenaEvents, newFilters);

            /* Setup Pills */
            // player names, // custom tag names
            this.activePills = pills.filter((pill) => {

                /* Team Players */
                if (pill.model === 'PlayersResource') {

                    let isTeamPlayer = newFilters.teamPlayersIds.some((playerId) => {
                        return pill.id === playerId;
                    });

                    if (isTeamPlayer) return isTeamPlayer;

                    let isOpposingTeamPlayer = newFilters.opposingTeamPlayersIds.some((playerId) => {
                        return pill.id === playerId;
                    });

                    return isOpposingTeamPlayer;

                } else if (pill.model === 'CustomtagsResource') {

                    let isCustomTag = newFilters.customTagIds.some((tagId) => {
                        return pill.id === tagId;
                    });

                    return isCustomTag;
                }
            });
        }, true
    );

    $scope.$watch(
        () => {

            return this.removedPill;

        },
        (pill) => {

            if (!pill) return;

            if (pill.model === 'PlayersResource') {

                let index = this.filters.teamPlayersIds.indexOf(pill.id);
                if (index != -1) this.filters.teamPlayersIds.splice(index, 1);

                index = this.filters.opposingTeamPlayersIds.indexOf(pill.id);
                if (index != -1) this.filters.opposingTeamPlayersIds.splice(index, 1);

            } else if (pill.model === 'CustomtagsResource') {

                index = this.filters.customTagIds.indexOf(pill.id);
                if (index != -1) this.filters.customTagIds.splice(index, 1);
            }

            this.removedPill = null;
        }
    );
}

GamesArenaChart.controller('GamesArenaChart.controller', GamesArenaChartController);
