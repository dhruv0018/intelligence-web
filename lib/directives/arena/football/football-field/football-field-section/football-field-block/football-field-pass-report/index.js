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
                completions: '@',
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

        return FootballFieldPassReport;
    }
]);

