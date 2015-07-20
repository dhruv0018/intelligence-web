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
    'TeamsFactory',
    'CustomtagsFactory',
    'GamesFactory',
    'PlayersFactory',
    '$stateParams'
];

function ArenaChartFiltersDirective(
    EVENT,
    eventEmitter,
    teams,
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

        let gameId = Number($stateParams.id);
        let game = games.get(gameId);
        let team = teams.get(game.teamId);
        let opposingTeam = teams.get(game.opposingTeamId);

        let rosterId = game.getRoster(game.teamId).id;
        let teamPlayerList = players.getList({rosterId});

        rosterId = game.getRoster(game.opposingTeamId).id;
        let opposingTeamPlayerList = players.getList({rosterId});

        let customTags = customtags.getList({teamId: team.id});

        scope.customTags = customTags;
        scope.game = game;
        scope.team = team;
        scope.opposingTeam = opposingTeam;
        scope.teamPlayerList = teamPlayerList.map((player) => {
            return {
                id: player.id,
                label: player.shortName
            };
        });
        scope.opposingTeamPlayerList = opposingTeamPlayerList.map((player) => {
            return {
                id: player.id,
                label: player.shortName
            };
        });


        /* Shot Chart Filter Defaults */

        let filterModelDefault = {
            teamPlayersIds: [],
            opposingTeamPlayersIds: [],
            teamId: game.teamId,
            opposingTeamId: game.opposingTeamId,
            customTagIds: [],
            shots: {
                made: true,
                missed: true
            },
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
