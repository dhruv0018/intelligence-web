/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/passing-zone.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PassingZone
 * @module PassingZone
 */
var PassingZone = angular.module('Item.PassingZone', []);

/* Cache the template file */
PassingZone.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PassingZone directive.
 * @module PassingZone
 * @name PassingZone
 * @type {Directive}
 */
PassingZone.directive('krossoverItemPassingZone', [
    'ROLES', 'ZONES', 'ZONE_IDS', 'SessionService',
    function directive(ROLES, ZONES, ZONE_IDS, session) {

        var PassingZone = {

            restrict: TO += ELEMENTS,
            controller: 'PassingZoneController',
            controllerAs: 'passingZoneController',
            templateUrl: templateUrl
        };

        return PassingZone;
    }
]);


PassingZone.controller('PassingZoneController', [
    '$scope', 'ROLES', 'ZONES', 'ZONE_IDS', 'SessionService',
    function PassingZoneController($scope, ROLES, ZONES, ZONE_IDS, session) {
        $scope.ZONES = ZONES;
        $scope.ZONE_IDS = ZONE_IDS;
        $scope.isReset = false;

        $scope.onChange = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index + 1;
            }
        };

        $scope.onBlur = function() {
            $scope.isReset = false;
            if (!$scope.event.variableValues[$scope.item.id].value) {
                if ($scope.item.isRequired) {
                    $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                } else {
                    $scope.event.variableValues[$scope.item.id].value = null;
                }
            }
        };

        $scope.shouldFocus = function() {
            if ($scope.autoAdvance === true) {
                return $scope.event.activeEventVariableIndex == $scope.item.index;
            } else {
                return $scope.isReset;
            }
        };

    }
]);

