/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-section.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldSection
 * @module FootballFieldSection
 */
var FootballFieldSection = angular.module('Arena.Football.FootballFieldSection', []);

/* Cache the template file */
FootballFieldSection.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldSection directive.
 * @module FootballFieldSection
 * @name FootballFieldSection
 * @type {Directive}
 */
FootballFieldSection.directive('krossoverArenaFootballFieldSection', [
    'ZONES', 'ZONE_IDS',
    function directive(ZONES, ZONE_IDS) {

        var FootballFieldSection = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: true,
            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return FootballFieldSection;
    }
]);

