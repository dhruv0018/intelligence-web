/* Component dependencies */
require('football-field-pass-report');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-block.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldBlock
 * @module FootballFieldBlock
 */
var FootballFieldBlock = angular.module('Arena.Football.FootballFieldBlock', [
    'Arena.Football.FootballFieldPassReport'
]);

/* Cache the template file */
FootballFieldBlock.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldBlock directive.
 * @module FootballFieldBlock
 * @name FootballFieldBlock
 * @type {Directive}
 */
FootballFieldBlock.directive('krossoverArenaFootballFieldBlock', [
    function directive() {

        var FootballFieldBlock = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: {
                block: '=',
                width: '@',
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
        }

        return FootballFieldBlock;
    }
]);

