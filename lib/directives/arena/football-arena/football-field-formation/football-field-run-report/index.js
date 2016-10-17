/* Component dependencies */
import FootballFieldGapReport from './football-field-gap-report/index.js';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-formation/football-field-run-report/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldRunReport
 * @module FootballFieldRunReport
 */
var FootballFieldRunReport = angular.module('Arena.Football.FootballFieldRunReport', [
    'Arena.Football.FootballFieldGapReport'
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
                game: '=',
                plays: '=',
                teamId: '=',
                opposingTeamId: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                league: '=',
                chart: '=',
                redzone: '='
            },
            templateUrl: templateUrl
        };

        return FootballFieldRunReport;
    }
]);

export default FootballFieldRunReport;
