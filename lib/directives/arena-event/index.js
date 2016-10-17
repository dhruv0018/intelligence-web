/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Component resources */
const templateUrl = 'lib/directives/arena-event/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaEvent
* @module ArenaEvent
*/
const ArenaEvent = angular.module('ArenaEvent', []);

/**
* ArenaEvent directive.
* @module ArenaEvent
* @name ArenaEvent
* @type {Directive}
*/
ArenaEventDirective.$inject = [
    'ARENA_CHART',
    'GamesFactory',
    '$stateParams'
];

function ArenaEventDirective(
    ARENA_CHART,
    games,
    $stateParams
) {

    let arenaEvent = {

        restrict: TO += ELEMENTS,
        templateUrl,
        link: arenaEventLink,
        scope: {
            arenaEvent: '='
        }
    };

    function arenaEventLink(scope, element, attributes) {

        let gameId = Number($stateParams.id);
        let game = games.get(gameId);

        scope.OUTCOME = ARENA_CHART.ARENA_EVENTS.OUTCOME;

        if (scope.arenaEvent.teamId === game.teamId) {

            scope.innerStyle = {fill: game.primaryJerseyColor};

        } else if (scope.arenaEvent.teamId === game.opposingTeamId) {

            scope.innerStyle = {fill: game.opposingPrimaryJerseyColor};
        }
    }

    return arenaEvent;
}

ArenaEvent.directive('arenaEvent', ArenaEventDirective);

export default ArenaEvent;
