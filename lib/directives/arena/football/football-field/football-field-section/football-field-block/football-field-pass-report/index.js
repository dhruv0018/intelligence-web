/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-pass-report.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldPassReport
 * @module FootballFieldPassReport
 */
var FootballFieldPassReport = angular.module('Arena.Football.FootballFieldPassReport', []);

/* Cache the template file */
FootballFieldPassReport.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldPassReport directive.
 * @module FootballFieldPassReport
 * @name FootballFieldPassReport
 * @type {Directive}
 */
FootballFieldPassReport.directive('krossoverArenaFootballFieldPassReport', [
    function directive() {

        var FootballFieldPassReport = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: {
                width: '@',
                passes: '@',
                completions: '@'
            },
            templateUrl: templateUrl
        };

        return FootballFieldPassReport;
    }
]);
