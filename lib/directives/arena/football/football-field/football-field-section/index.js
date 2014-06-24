/* Component dependencies */
require('football-field-block');

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
var FootballFieldSection = angular.module('Arena.Football.FootballFieldSection', [
    'Arena.Football.FootballFieldBlock'
]);

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
            scope: {
                color: '@',
                blocks: '=',
                hashWidth: '@',
                hashThickness: '@',
                game: '=',
                plays: '=',
                team: '=',
                league: '='
            },
            compile: compile,
            templateUrl: templateUrl
        };

        function compile(element, attributes) {

            attributes.hashWidth = attributes.hashWidth || 13;
            attributes.hashThickness = attributes.hashThickness || 2;
        }

        return FootballFieldSection;
    }
]);

