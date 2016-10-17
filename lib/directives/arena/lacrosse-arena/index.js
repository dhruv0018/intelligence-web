/* Component dependencies */
import MensOutdoorLacrosseArena from './lacrosse-mens-outdoor-arena/index.js';
import WomensOutdoorLacrosseArena from './lacrosse-womens-outdoor-arena/index.js';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/lacrosse-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Lacrosse Arena
 * @module Lacrosse Arena
 */
var LacrosseArena = angular.module('Arena.Lacrosse', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Lacrosse.MensOutdoor',
    'Arena.Lacrosse.WomensOutdoor'
]);

/**
 * Lacrosse Arena directive.
 * @module Lacrosse Arena
 * @name Lacrosse Arena
 * @type {Directive}
 */
LacrosseArena.directive('lacrosseArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        var LacrosseArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            templateUrl: templateUrl
        };

        return LacrosseArena;
    }
]);

export default LacrosseArena;
