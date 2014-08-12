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
    'PlaysFactory',
    function directive(plays) {

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

            $scope.$watch('playIds', function(playIds) {
                $scope.currentPlays = [];
                angular.forEach(playIds, function(value, key) {
                    this.push(plays.get(value));
                }, $scope.currentPlays);
            }, true);

            $scope.options = {scope: $scope};
        }

        return FootballFieldPassReport;
    }
]);

