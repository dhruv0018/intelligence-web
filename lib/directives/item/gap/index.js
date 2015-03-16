/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/gap.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Gap
 * @module Gap
 */
var Gap = angular.module('Item.Gap', []);

/* Cache the template file */
Gap.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Gap directive.
 * @module Gap
 * @name Gap
 * @type {Directive}
 */
Gap.directive('krossoverItemGap', [
    'ROLES', 'GAPS', 'GAP_IDS', 'SessionService',
    function directive(ROLES, GAPS, GAP_IDS, session) {

        var Gap = {

            restrict: TO += ELEMENTS,
            controller: 'GapController',
            controllerAs: 'gapController',
            templateUrl: templateUrl
        };



        return Gap;
    }
]);

Gap.controller('GapController', [
    '$scope', 'ROLES', 'GAPS', 'GAP_IDS', 'SessionService',
    function GapController($scope, ROLES, GAPS, GAP_IDS, session) {
        $scope.GAPS = GAPS;
        $scope.GAP_IDS = GAP_IDS;

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

        $scope.reset = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index;
            } else {
                $scope.event.activeEventVariableIndex = 0;
            }
            $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
            $scope.event.variableValues[$scope.item.id].value = undefined;
            $scope.isReset = true;
        };
    }
]);

