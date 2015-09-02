/* Component dependencies */
require('lacrosse-mens-outdoor-arena');
require('lacrosse-womens-outdoor-arena');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/lacrosse/template.html';

/* Component resources */
var template = require('./template.html');

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

/* Cache the template file */
LacrosseArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
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
