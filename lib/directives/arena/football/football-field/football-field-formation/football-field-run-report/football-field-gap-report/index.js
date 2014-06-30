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
    function directive() {

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
                league: '=',
                chart: '='
            },
            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {
            var currentPlays = [];
            $scope.$watch('playIds', function(playIds) {
                angular.forEach(playIds, function(value, key) {
                    this.push($scope.plays[value]);
                }, currentPlays);
            });
            $scope.options = {
                game: $scope.game,
                plays: currentPlays,
                team: $scope.team,
                league: $scope.league
            };
        }

        return FootballFieldGapReport;
    }
]);

