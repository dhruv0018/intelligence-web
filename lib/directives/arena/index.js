/* Component dependencies */
require('football-arena');
require('basketball-arena');
require('lacrosse-arena');

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
    'Arena.Football',
    'Arena.Basketball',
    'Arena.Lacrosse',
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
                league: '=',
                region: '=?ngModel'
            },

            controller: 'Arena.controller',

            templateUrl: templateUrl
        };

        return Arena;
    }
]);

/**
 * Arena Controller
 * @module Arena
 * @name Arena
 * @type {Controller}
 */
Arena.controller('Arena.controller', [
    '$scope', 'ARENA_TYPES',
    function controller($scope, ARENA_TYPES) {

        $scope.type = ARENA_TYPES[$scope.league.arenaId].type;

        $scope.$watch('$parent.redzone', function watchRedzone(redzone) {
            $scope.redzone = redzone;
        });

        $scope.$watch('$parent.chart', function watchChart(chart) {
            $scope.chart = chart;
        });
    }
]);

