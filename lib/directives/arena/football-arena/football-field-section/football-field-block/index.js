/* Component dependencies */
import FootballFieldPassReport from './football-field-pass-report/index.js';
/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-section/football-field-block/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldBlock
 * @module FootballFieldBlock
 */
var FootballFieldBlock = angular.module('Arena.Football.FootballFieldBlock', [
    'Arena.Football.FootballFieldPassReport'
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
            templateUrl: templateUrl
        };

        return FootballFieldBlock;
    }
]);

export default FootballFieldBlock;
