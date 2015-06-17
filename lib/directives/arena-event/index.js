/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');

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
        $templateCache.put('ArenaEvent.html', template);
    }
]);

/**
* ArenaEvent directive.
* @module ArenaEvent
* @name ArenaEvent
* @type {Directive}
*/
ArenaEventDirective.$inject = [
];

function ArenaEventDirective(
) {

    let arenaEvent = {

        restrict: TO += ELEMENTS,
        templateUrl: 'ArenaEvent.html',
        link: arenaEventLink,
        scope: {
            arenaEvent: '='
        }
    };

    function arenaEventLink(scope, element, attributes) {

    }

    return arenaEvent;
}

ArenaEvent.directive('arenaEvent', ArenaEventDirective);
