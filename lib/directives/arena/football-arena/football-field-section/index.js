/* Component dependencies */
require('football-field-block');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-section.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldSection
 * @module FootballFieldSection
 */
var FootballFieldSection = angular.module('Arena.Football.FootballFieldSection', [
    'Arena.Football.FootballFieldBlock'
]);

/* Cache the template file */
FootballFieldSection.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
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
            require: '^krossoverArenaFootballField',
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
