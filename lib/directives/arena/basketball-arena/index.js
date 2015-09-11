/* Component dependencies */
require('basketball-hs-arena');
require('basketball-ncaa-arena');
require('basketball-nba-arena');
require('basketball-fiba-arena');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Basketball Arena
 * @module Basketball Arena
 */
var BasketballArena = angular.module('Arena.Basketball', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Basketball.HighSchool',
    'Arena.Basketball.NCAA',
    'Arena.Basketball.NBA',
    'Arena.Basketball.FIBA'
]);

/* Cache the template file */
BasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Basketball Arena directive.
 * @module Basketball Arena
 * @name Basketball Arena
 * @type {Directive}
 */
BasketballArena.directive('basketballArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        var BasketballArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=?ngModel'
            },

            templateUrl
        };

        return BasketballArena;
    }
]);
