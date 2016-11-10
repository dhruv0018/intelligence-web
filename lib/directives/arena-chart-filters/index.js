/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/arena-chart-filters/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaChartFilters
* @module ArenaChartFilters
*/
const ArenaChartFilters = angular.module('ArenaChartFilters', []);

/**
* ArenaChartFilters directive.
* @module ArenaChartFilters
* @name ArenaChartFilters
* @type {Directive}
*/

ArenaChartFiltersDirective.$inject = [
    'SPORT_IDS',
    'EVENT',
    'EventEmitter',
    'PositionsetsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'SessionService',
    'CustomtagsFactory',
    'GamesFactory',
    'PlayersFactory',
    '$stateParams'
];

function ArenaChartFiltersDirective(
    SPORT_IDS,
    EVENT,
    eventEmitter,
    positionsets,
    leagues,
    teams,
    session,
    customtags,
    games,
    players,
    $stateParams
) {

    let arenaChartFilters = {

        restrict: TO += ELEMENTS,

        templateUrl,

        scope: {
            filterModel: '='
        },

        link: ArenaChartFiltersLink
    };

    function ArenaChartFiltersLink(scope, element, attributes) {

        const gameId = Number($stateParams.id);
        const game = games.get(gameId);
        const team = teams.get(game.teamId);
        const opposingTeam = teams.get(game.opposingTeamId);
        const league = leagues.get(team.leagueId);
        const positionset = positionsets.get(league.positionSetId);
        const teamPlayers = game.getTeamPlayers();
        const opposingTeamPlayers = game.getOpposingTeamPlayers();
        const teamRoster = game.getRoster(game.teamId);
        const opposingTeamRoster = game.getRoster(game.opposingTeamId);
        const customTags = customtags.getList({teamId: game.uploaderTeamId});

        scope.game = game;
        scope.team = team;
        scope.opposingTeam = opposingTeam;
        scope.league = league;
        scope.SPORT_IDS = SPORT_IDS;

        // Initializes empty array of size 'numberOfPeriods' and maps indices to periods increased by one.
        scope.periods = Array.apply(null, new Array(league.numberOfPeriods)).map((item, index) => index + 1);

        scope.customTagLabels = customTags.map((customTag) => {
            return {
                id: customTag.id,
                label: customTag.name
            };
        });

        scope.teamPlayerLabels = teamPlayers.map(player => getPlayerLabel(player, teamRoster));
        scope.opposingTeamPlayerLabels = opposingTeamPlayers.map(player => getPlayerLabel(player, opposingTeamRoster));

        /* Gets the standard player label with the addition of the
         * player's positionNames
         */
        function getPlayerLabel(player, roster) {

            let playerTitle = player.getPlayerTitle(roster);
            let positionNames = positionset.getPlayerPositionNames(roster, player.id);

            let label = playerTitle;
            label += positionNames.length ? ' ' + positionNames : '';

            return {
                id: player.id,
                label: label
            };
        }

        /* Shot Chart Filter Defaults */

        const filterModelDefault = {
            teamPlayersIds: [],
            opposingTeamPlayersIds: [],
            teamId: game.teamId,
            opposingTeamId: game.opposingTeamId,
            customTagIds: [],
            shots: {
                made: true,
                missed: true,
                blocked: true,
                saved: true
            },
            allPeriods: true,
            periods: {
                OT: false
            }
        };

        for (let index in leagues.numberOfPeriods) {
            filterModelDefault.periods[index+1] = false;
        }

        scope.filterModel = angular.copy(filterModelDefault);

        /* Watches */

        scope.$on('$destroy', onDestroy);
        eventEmitter.on(EVENT.ARENA_CHART.FILTERS.RESET, onResetFilters);

        function onResetFilters() {

            scope.filterModel = angular.copy(filterModelDefault);
        }

        function onDestroy() {

            eventEmitter.removeListener(EVENT.ARENA_CHART.FILTERS.RESET, onResetFilters);
        }
    }

    return arenaChartFilters;
}

ArenaChartFilters.directive('arenaChartFilters', ArenaChartFiltersDirective);

export default ArenaChartFilters;
