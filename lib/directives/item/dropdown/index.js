/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Dropdown
 * @module Dropdown
 */
var Dropdown = angular.module('Item.Dropdown', []);

/* Cache the template file */
Dropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Dropdown directive.
 * @module Dropdown
 * @name Dropdown
 * @type {Directive}
 */
Dropdown.directive('krossoverItemDropdown', [
    'ROLES', 'SessionService',
    function directive(ROLES, session) {

        var Dropdown = {

            restrict: TO += ELEMENTS,
            controller: 'ItemDropdownController',
            controllerAs: 'dropdownController',
            templateUrl: templateUrl
        };

        return Dropdown;
    }
]);

Dropdown.controller('ItemDropdownController',[
    '$scope', 'ROLES', 'SessionService',
    function DropdownController($scope, ROLES, session) {
        $scope.options = ($scope.item && $scope.item.options) ? JSON.parse($scope.item.options) : [];

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

