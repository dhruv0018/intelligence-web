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
    'ARENA_TYPES',
    function directive(ARENA_TYPES) {

        var Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                league: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            /* TO-DO: Hot fix for football arenas
             * Remove once arenaIds on are on the league object */

            if ($scope.league.sportId === 2) {
                $scope.league.arenaId = 7;
            }

            $scope.type = ARENA_TYPES[$scope.league.arenaId].type;

            $scope.$watch('$parent.redzone', function(redzone) {
                $scope.redzone = redzone;
            });

            $scope.$watch('$parent.chart', function(chart) {
                $scope.chart = chart;
            });
        }

        return Arena;
    }
]);

