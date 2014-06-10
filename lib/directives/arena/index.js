/* Component dependencies */
require('football-field');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena
 * @module Arena
 */
var Arena = angular.module('Arena', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Football.FootballField'
]);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverArena', [
    function directive() {

        var Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                type: '@'
            },

            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Arena;
    }
]);
