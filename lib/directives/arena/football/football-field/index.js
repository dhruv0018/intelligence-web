/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballField
 * @module FootballField
 */
var FootballField = angular.module('Arena.Football.FootballField', []);

/* Cache the template file */
FootballField.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballField directive.
 * @module FootballField
 * @name FootballField
 * @type {Directive}
 */
FootballField.directive('krossoverArenaFootballField', [
    'ZONES', 'ZONE_IDS',
    function directive(ZONES, ZONE_IDS) {

        var FootballField = {

            restrict: TO += ELEMENTS,
            scope: true,
            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return FootballField;
    }
]);

