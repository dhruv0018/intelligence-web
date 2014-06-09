/* Component dependencies */
require('football-field-section');
require('football-field-line-of-scrimmage');
require('football-field-formation');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballField
 * @module FootballField
 */
var FootballField = angular.module('Arena.Football.FootballField', [
    'Arena.Football.FootballFieldSection',
    'Arena.Football.FootballFieldLineOfScrimmage',
    'Arena.Football.FootballFieldFormation'
]);

/* Cache the template file */
FootballField.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballField directive.
 * @module FootballField
 * @name FootballField
 * @type {Directive}
 */
FootballField.directive('krossoverArenaFootballField', [
    function directive() {

        var FootballField = {

            restrict: TO += ELEMENTS,
            scope: {
                game: '=',
                plays: '=',
                team: '=',
                league: '='
            },
            link: link,
            controller: 'Arena.Football.FootballField.controller',
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return FootballField;
    }
]);


FootballField.controller('Arena.Football.FootballField.controller', [
    '$scope', 'ZONE_AREAS',
    function($scope, ZONE_AREAS) {

        $scope.LOSS_ZONES = ZONE_AREAS.LOSS_ZONES;
        $scope.FLAT_ZONES = ZONE_AREAS.FLAT_ZONES;
        $scope.FORWARD_ZONES = ZONE_AREAS.FORWARD_ZONES;
        $scope.DEEP_ZONES = ZONE_AREAS.DEEP_ZONES;
    }
]);

