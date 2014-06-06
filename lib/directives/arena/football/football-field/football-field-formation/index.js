/* Component dependencies */
require('football-field-run-report');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-formation.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldFormation
 * @module FootballFieldFormation
 */
var FootballFieldFormation = angular.module('Arena.Football.FootballFieldFormation', [
    'Arena.Football.FootballFieldRunReport'
]);

/* Cache the template file */
FootballFieldFormation.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldFormation directive.
 * @module FootballFieldFormation
 * @name FootballFieldFormation
 * @type {Directive}
 */
FootballFieldFormation.directive('krossoverArenaFootballFieldFormation', [
    function directive() {

        var FootballFieldFormation = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: {
                placement: '@',
                game: '='
            },
            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var placements = {

                left: 1 / 3 * 100,
                middle: 50,
                right: 2 / 3 * 100
            };

            $scope.left = placements[$scope.placement];

            $scope.runs = {

                D_LEFT: {
                    runs: 1,
                    avgYards: 10
                },
                C_LEFT: {
                    runs: 0,
                    avgYards: 0
                },
                B_LEFT: {
                    runs: 4,
                    avgYards: 4
                },
                A_LEFT: {
                    runs: 0,
                    avgYards: 0
                },
                A_RIGHT: {
                    runs: 6,
                    avgYards: 8
                },
                B_RIGHT: {
                    runs: 3,
                    avgYards: 2
                },
                C_RIGHT: {
                    runs: 2,
                    avgYards: 2
                },
                D_RIGHT: {
                    runs: 1,
                    avgYards: 10
                }
            };
        }

        return FootballFieldFormation;
    }
]);

