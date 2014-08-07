/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-gap-report.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldGapReport
 * @module FootballFieldGapReport
 */
var FootballFieldGapReport = angular.module('Arena.Football.FootballFieldGapReport', []);

/* Cache the template file */
FootballFieldGapReport.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldGapReport directive.
 * @module FootballFieldGapReport
 * @name FootballFieldGapReport
 * @type {Directive}
 */
FootballFieldGapReport.directive('krossoverArenaFootballFieldGapReport', [
    'PlaysFactory',
    function directive(plays) {

        var FootballFieldGapReport = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
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
            $scope.$watch('playIds', function(playIds) {
                $scope.currentPlays = [];
                angular.forEach(playIds, function(value, key) {
                    this.push(plays.get(value));
                }, $scope.currentPlays);
            });

            $scope.options = {scope: $scope};
        }

        return FootballFieldGapReport;
    }
]);

