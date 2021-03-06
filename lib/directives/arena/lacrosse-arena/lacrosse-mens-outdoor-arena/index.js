/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/lacrosse-arena/lacrosse-mens-outdoor-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Men's Outdoor Lacrosse Arena
 * @module Men's Outdoor Lacrosse Arena
 */
var MensOutdoorLacrosseArena = angular.module('Arena.Lacrosse.MensOutdoor', []);

/**
 * Men's Outdoor Lacrosse Arena directive.
 * @module Men's Outdoor Lacrosse Arena
 * @name Men's Outdoor Lacrosse Arena
 * @type {Directive}
 */
MensOutdoorLacrosseArena.directive('lacrosseMensOutdoorArena', [
    'ARENA_REGIONS',
    function directive(
        ARENA_REGIONS
    ) {

        var Arena = {

            restrict: TO += ELEMENTS,

            link,

            require: '^krossoverArena',

            templateUrl
        };

        function link(scope, element, attributes, arenaController) {

            const regionsConstant = Object.assign({}, ARENA_REGIONS.LACROSSE);

            arenaController.bindClickListeners(element[0], regionsConstant, scope);
        }

        return Arena;
    }
]);

export default MensOutdoorLacrosseArena;
