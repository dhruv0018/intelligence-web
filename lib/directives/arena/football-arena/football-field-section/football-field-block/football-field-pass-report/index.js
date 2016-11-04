/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-section/football-field-block/football-field-pass-report/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldPassReport
 * @module FootballFieldPassReport
 */
var FootballFieldPassReport = angular.module('Arena.Football.FootballFieldPassReport', []);

/**
 * FootballFieldPassReport directive.
 * @module FootballFieldPassReport
 * @name FootballFieldPassReport
 * @type {Directive}
 */
FootballFieldPassReport.directive('krossoverArenaFootballFieldPassReport', [
    'PlaysFactory', 'BreakdownPopup.Modal',
    function directive(plays, breakdownModal) {

        var FootballFieldPassReport = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: {
                width: '@',
                passes: '@',
                completions: '@',
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

            $scope.footballFieldPassReportClick = ($event) => {

                openBreakdownModal($event);
            };

            function openBreakdownModal($event) {

                breakdownModal.open($scope.playIds);
            }
        }

        return FootballFieldPassReport;
    }
]);

export default FootballFieldPassReport;
