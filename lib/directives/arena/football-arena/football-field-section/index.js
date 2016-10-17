/* Component dependencies */
import FootballFieldBlock from './football-field-block/index.js';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-section/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldSection
 * @module FootballFieldSection
 */
var FootballFieldSection = angular.module('Arena.Football.FootballFieldSection', [
    'Arena.Football.FootballFieldBlock'
]);

/**
 * FootballFieldSection directive.
 * @module FootballFieldSection
 * @name FootballFieldSection
 * @type {Directive}
 */
FootballFieldSection.directive('krossoverArenaFootballFieldSection', [
    'ZONES', 'ZONE_IDS',
    function directive(ZONES, ZONE_IDS) {

        var FootballFieldSection = {

            restrict: TO += ELEMENTS,
            // require: '^krossoverArenaFootballField',
            scope: {
                color: '@',
                blocks: '=',
                hashWidth: '@',
                hashThickness: '@',
                game: '=',
                plays: '=',
                playIds: '=',
                teamId: '=',
                opposingTeamId: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                league: '=',
                chart: '=',
                redzone: '='
            },
            compile: compile,
            link: link,
            controller: 'FootballFieldSection.controller',
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {
            $scope.$watch('playIds', function watchPlayIds(playIds) {
                $scope.currentPlays = playIds.map(playId => plays.get(playId));
            });

            $scope.options = {scope: $scope};
        }

        function compile(element, attributes) {

            attributes.hashWidth = attributes.hashWidth || 13;
            attributes.hashThickness = attributes.hashThickness || 2;
        }

        return FootballFieldSection;
    }
]);

/**
 * FootballFieldSection controller.
 * @module FootballFieldSection
 * @name FootballFieldSection.controller
 * @type {controller}
 */
FootballFieldSection.controller('FootballFieldSection.controller', [
    '$scope',
    function controller($scope) {
        $scope.reverseBlocks = angular.copy($scope.blocks).reverse();
    }
]);

export default FootballFieldSection;
