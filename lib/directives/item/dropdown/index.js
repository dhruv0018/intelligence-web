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
            controller: dropdownController,
            controllerAs: 'dropdownController',
            templateUrl: templateUrl
        };

        function dropdownController($scope) {

            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

            var currentUser = session.currentUser;

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);

            $scope.options = JSON.parse($scope.item.options);

            $scope.isReset = false;

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

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

        return Dropdown;
    }
]);

