/* Fetch angular from the browser scope */
const angular = window.angular;

import ArenaChartDataDependencies from './data.js';

const GamesArenaChart = angular.module('Games.ArenaChart', []);

GamesArenaChart.factory('ArenaChartDataDependencies', ArenaChartDataDependencies);

GamesArenaChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/arena-chart.html', require('./template.html'));
    }
]);

GamesArenaChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const arenaChart = {
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

/* ArenaChart Controller */

GamesArenaChartController.$inject = [
    'EventEmitter',
    'EVENT',
    'ARENA_TYPES',
    'PositionsetsFactory',
    'CustomtagsFactory',
    'PlayersFactory',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'SessionService',
    '$stateParams',
    '$filter',
    '$scope'
];

function GamesArenaChartController(
    eventEmitter,
    EVENT,
    ARENA_TYPES,
    positionsets,
    customtags,
    players,
    games,
    teams,
    leagues,
    session,
    $stateParams,
    $filter,
    $scope
) {

    const game = games.get($stateParams.id);
    const team = teams.get(game.teamId);
    const opposingTeam = teams.get(game.opposingTeamId);
    const league = leagues.get(team.leagueId);
    const arenaEvents = game.getArenaEvents();
    const currentTeamId = session.getCurrentTeamId();
    const customTags = customtags.getList({teamId: currentTeamId});

    const gameTeamRoster = game.getRoster(game.teamId);
    const teamPlayerList = players.getList({rosterId: gameTeamRoster.id});

    const gameOpposingTeamRoster = game.getRoster(game.opposingTeamId);
    const opposingTeamPlayerList = players.getList({rosterId: gameOpposingTeamRoster.id});

    // Determine arena type
    this.arenaType = ARENA_TYPES[league.arenaId].type;
    this.arenaEvents = arenaEvents;

    /* Construct pills */

    const pills = [];

    teamPlayerList.forEach((player) => {
        const playerCopy = angular.copy(player);
        const jerseyNumber = player.getJerseyNumber(game.rosters[team.id]);
        playerCopy.name = jerseyNumber ? `${jerseyNumber} ${player.shortName}` : player.shortName;
        pills.push(playerCopy);
    });

    opposingTeamPlayerList.forEach((player) => {
        const playerCopy = angular.copy(player);
        const jerseyNumber = player.getJerseyNumber(game.rosters[opposingTeam.id]);
        playerCopy.name = jerseyNumber ? `${jerseyNumber} ${player.shortName}` : player.shortName;
        pills.push(playerCopy);
    });

    customTags.forEach((tag) => {
        pills.push(tag);
    });

    this.activePills = pills;

    /* reset filters */
    this.resetFilters = () => eventEmitter.emit(EVENT.ARENA_CHART.FILTERS.RESET);

    this.pillRemoved = (pill) => {

        if (!pill) return;

        let index;

        if (pill.model === 'PlayersResource') {

            index = this.filters.teamPlayersIds.indexOf(pill.id);
            if (index != -1) this.filters.teamPlayersIds.splice(index, 1);

            index = this.filters.opposingTeamPlayersIds.indexOf(pill.id);
            if (index != -1) this.filters.opposingTeamPlayersIds.splice(index, 1);

        } else if (pill.model === 'CustomtagsResource') {

            index = this.filters.customTagIds.indexOf(pill.id);
            if (index != -1) this.filters.customTagIds.splice(index, 1);
        }
    };

    $scope.$watch(
        () => {

            return this.filters;

        },
        (newFilters) => {

            if (!newFilters) return;

            /* Filter out active pills */
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
}

GamesArenaChart.controller('GamesArenaChart.controller', GamesArenaChartController);
