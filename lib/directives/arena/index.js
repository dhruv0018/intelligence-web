
/* Component dependencies */
require('football-arena');
require('basketball-arena');
require('lacrosse-arena');
require('volleyball-arena');
require('ice-hockey-arena');

/* Constants */
let TO = '';
let ELEMENTS = 'E';

const templateUrl = 'arena/template.html';

/* Component resources */
const template = require('./template.html');
import controller from './controller';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Arena
 * @module Arena
 */
const Arena = angular.module('Arena', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Football',
    'Arena.Basketball',
    'Arena.Lacrosse',
    'Arena.Volleyball',
    'Arena.IceHockey'
]);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena controller.
 * @module Arena
 * @name Arena
 * @type {Controller}
 */
Arena.controller('Arena.Controller', controller);
controller.$inject = [
    '$scope'
];

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverArena', [
    function directive() {

        const Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                type: '=',
                region: '=?ngModel',
                chart: '=?',
                redzone: '=?',
                plays: '=?',
                highlightRegions: '=?'
            },

            templateUrl,

            controller,

            transclude: true
        };

        return Arena;
    }
]);
