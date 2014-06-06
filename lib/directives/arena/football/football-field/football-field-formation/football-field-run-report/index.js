/* Component dependencies */
require('football-field-gap-report');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-run-report.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldRunReport
 * @module FootballFieldRunReport
 */
var FootballFieldRunReport = angular.module('Arena.Football.FootballFieldRunReport', [
    'Arena.Football.FootballFieldGapReport'
]);

/* Cache the template file */
FootballFieldRunReport.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldRunReport directive.
 * @module FootballFieldRunReport
 * @name FootballFieldRunReport
 * @type {Directive}
 */
FootballFieldRunReport.directive('krossoverArenaFootballFieldRunReport', [
    function directive() {

        var FootballFieldRunReport = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: {
                gaps: '=runs',
                game: '='
            },
            templateUrl: templateUrl
        };

        return FootballFieldRunReport;
    }
]);

