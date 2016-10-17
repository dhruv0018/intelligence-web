/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-formation/football-field-run-report/football-field-gap-report/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldGapReport
 * @module FootballFieldGapReport
 */
var FootballFieldGapReport = angular.module('Arena.Football.FootballFieldGapReport', []);

/**
 * FootballFieldGapReport directive.
 * @module FootballFieldGapReport
 * @name FootballFieldGapReport
 * @type {Directive}
 */
FootballFieldGapReport.directive('krossoverArenaFootballFieldGapReport', [
    'PlaysFactory', 'BreakdownDialog.Service',
    function directive(plays, breakdownDialog) {

        var FootballFieldGapReport = {

            restrict: TO += ELEMENTS,
            // require: '^krossoverArenaFootballField',
            scope: {
                runs: '@',
                avgYards: '@',
                playIds: '=',
                game: '=',
                plays: '=',
                teamId: '=',
                opposingTeamId: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                league: '=',
                chart: '='
            },
            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.onFieldGapReportClick = ($event) => {

                $scope.openBreakdownModal($event);
            };

            $scope.openBreakdownModal = ($event) => {

                const breakdownDialogPromise = breakdownDialog.show($event, null, $scope.playIds);
            };
        }

        return FootballFieldGapReport;
    }
]);

export default FootballFieldGapReport;
