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
    'GamesFactory',
    'PlayersFactory',
    '$stateParams'
];

function ArenaChartFiltersDirective(
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

    function ArenaChartFiltersLink(scope, attributes, element) {

        let gameId = Number($stateParams.id);
        let game = games.get(gameId);

        let teamPlayersFilter = {rosterId: game.getRoster(game.teamId).id};
        let teamPlayerList = players.getList(teamPlayersFilter);

        let opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
        let opposingTeamPlayerList = players.getList(opposingTeamPlayersFilter);

        scope.teamPlayerList = teamPlayerList;
        scope.opposingTeamPlayerList = opposingTeamPlayerList;
    }

    return arenaChartFilters;
}

ArenaChartFilters.directive('arenaChartFilters', ArenaChartFiltersDirective);
