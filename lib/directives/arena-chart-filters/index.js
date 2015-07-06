/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');
const templateURL = 'ArenaChartFilters.html';

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
        $templateCache.put(templateURL, template);
    }
]);

/**
* ArenaChartFilters directive.
* @module ArenaChartFilters
* @name ArenaChartFilters
* @type {Directive}
*/

ArenaChartFiltersDirective.$inject = [
    'CustomtagsFactory',
    'GamesFactory',
    'PlayersFactory',
    '$stateParams'
];

function ArenaChartFiltersDirective(
    customTags,
    games,
    players,
    $stateParams
) {

    let arenaChartFilters = {

        restrict: TO += ELEMENTS,

        templateUrl: templateURL,

        scope: {
            ngModel: '='
        },

        link: ArenaChartFiltersLink
    };

    function ArenaChartFiltersLink(scope, element, attributes) {

        let gameId = Number($stateParams.id);
        let game = games.get(gameId);

        let teamPlayersFilter = {rosterId: game.getRoster(game.teamId).id};
        let teamPlayerList = players.getList(teamPlayersFilter);

        let opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
        let opposingTeamPlayerList = players.getList(opposingTeamPlayersFilter);

        let customtags = customTags.getList();

        scope.teamPlayerList = teamPlayerList;
        scope.opposingTeamPlayerList = opposingTeamPlayerList;
        scope.customtags = customtags;


        /* Shot Chart Filter Defaults */

        let ngModelDefaults = {
            teamPlayersIds: [],
            opposingTeamPlayersIds: [],
            teamId: game.teamId,
            opposingTeamId: game.opposingTeamId,
            customTagIds: [],
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
            }
        };

        scope.ngModel = angular.copy(ngModelDefaults);

        /* Watches */

        scope.$on('arena-chart-filters:reset', onResetFilters);

        function onResetFilters() {

            scope.ngModel = angular.copy(ngModelDefaults);
        }
    }

    return arenaChartFilters;
}

ArenaChartFilters.directive('arenaChartFilters', ArenaChartFiltersDirective);
