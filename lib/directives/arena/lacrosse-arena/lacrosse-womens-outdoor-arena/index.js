/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/lacrosse-arena/lacrosse-womens-outdoor-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Women's Outdoor Lacrosse Arena
 * @module Women's Outdoor Lacrosse Arena
 */
var WomensOutdoorLacrosseArena = angular.module('Arena.Lacrosse.WomensOutdoor', []);

/**
 * Women's Outdoor Lacrosse Arena directive.
 * @module Women's Outdoor Lacrosse Arena
 * @name Women's Outdoor Lacrosse Arena
 * @type {Directive}
 */
WomensOutdoorLacrosseArena.directive('lacrosseWomensOutdoorArena', [
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

export default WomensOutdoorLacrosseArena;
