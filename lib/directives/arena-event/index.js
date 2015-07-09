/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');
const templateURL = 'ArenaEvent.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaEvent
* @module ArenaEvent
*/
const ArenaEvent = angular.module('ArenaEvent', []);

/* Cache the template file */
ArenaEvent.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateURL, template);
    }
]);

/**
* ArenaEvent directive.
* @module ArenaEvent
* @name ArenaEvent
* @type {Directive}
*/
ArenaEventDirective.$inject = [
    'GamesFactory',
    '$stateParams'
];

function ArenaEventDirective(
    games,
    $stateParams
) {

    let arenaEvent = {

        restrict: TO += ELEMENTS,
        templateUrl: templateURL,
        link: arenaEventLink,
        scope: {
            arenaEvent: '='
        }
    };

    function arenaEventLink(scope, element, attributes) {

        let gameId = Number($stateParams.id);
        let game = games.get(gameId);

        scope.game = game;

        if (scope.arenaEvent.teamId === game.teamId) {

            scope.arenaEventStyle = {color: game.primaryJerseyColor};

        } else if (scope.arenaEvent.teamId === game.opposingTeamId) {

            scope.arenaEventStyle = {color: game.opposingJerseyColor};
        }
    }

    return arenaEvent;
}

ArenaEvent.directive('arenaEvent', ArenaEventDirective);
