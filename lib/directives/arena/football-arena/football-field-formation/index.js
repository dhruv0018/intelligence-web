/* Component dependencies */
import FootballFieldRunReport from './football-field-run-report/index.js';
/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-formation/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldFormation
 * @module FootballFieldFormation
 */
var FootballFieldFormation = angular.module('Arena.Football.FootballFieldFormation', [
    'Arena.Football.FootballFieldRunReport'
]);

/**
 * FootballFieldFormation directive.
 * @module FootballFieldFormation
 * @name FootballFieldFormation
 * @type {Directive}
 */
FootballFieldFormation.directive('krossoverArenaFootballFieldFormation', [
    'GAPS',
    'FORMATIONS',
    'FORMATION_IDS',
    function directive(
        GAPS,
        FORMATIONS,
        FORMATION_IDS
    ) {

        var FootballFieldFormation = {

            restrict: TO += ELEMENTS,
            // require: '^krossoverArenaFootballField',
            scope: {
                placement: '@',
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

            $scope.runs = Object.keys(GAPS).map(function getGap(key) {return GAPS[key];}).reverse();

            if ($scope.chart) {
                //Determine Backfield Coordinates
                let backfieldFormationId = FORMATION_IDS[$scope.chart.backfieldFormationId];
                $scope.backfieldFormation = FORMATIONS[backfieldFormationId];

                //Determine Right Flank Coordinates
                let rightFlankFormationId = FORMATION_IDS[$scope.chart.rightFlankFormationId];
                $scope.rightFlankFormation = FORMATIONS[rightFlankFormationId];

                //Determine Right Flank Coordinates
                let leftFlankFormationId = FORMATION_IDS[$scope.chart.leftFlankFormationId];
                $scope.leftFlankFormation = FORMATIONS[leftFlankFormationId];
            }
        }

        return FootballFieldFormation;
    }
]);

export default FootballFieldFormation;
