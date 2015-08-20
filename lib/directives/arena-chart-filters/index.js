/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');
const templateUrl = 'ArenaChartFilters.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaChartFilters
* @module ArenaChartFilters
*/
const ArenaChartFilters = angular.module('ArenaChartFilters', []);

/* Cache the template file */
ArenaChartFilters.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
* ArenaChartFilters directive.
* @module ArenaChartFilters
* @name ArenaChartFilters
* @type {Directive}
*/

ArenaChartFiltersDirective.$inject = [
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
                missed: true
            },
            allPeriods: true,
            period: {
                one: false,
                two: false,
                three: false,
                four: false,
                overtime: false
            }
        };

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
