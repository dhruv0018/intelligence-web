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
var FootballFieldFormation = angular.module('Arena.Football.FootballFieldFormation', []);

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
                placement: '@'
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
        }

        return FootballFieldFormation;
    }
]);

