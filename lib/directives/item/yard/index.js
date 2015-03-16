/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/yard.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Yard
 * @module Yard
 */
var Yard = angular.module('Item.Yard', []);

/* Cache the template file */
Yard.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Yard directive.
 * @module Yard
 * @name Yard
 * @type {Directive}
 */
Yard.directive('krossoverItemYard', [
    'ROLES', 'SessionService',
    function directive(ROLES, session) {

        var Yard = {

            restrict: TO += ELEMENTS,
            controller: 'YardController',
            controllerAs: 'yardController',
            templateUrl: templateUrl
        };

        return Yard;
    }
]);

Yard.controller('YardController',[
    '$scope', 'ROLES', 'SessionService',
    function YardController($scope, ROLES, session) {

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


        $scope.$watch('variable.value', function(value) {

            if (value && value.length > 1) {

                $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                $scope.event.activeEventVariableIndex = $scope.item.index + 1;
            }
        });

        $scope.$watch('event.variableValues[item.id].value', function(value) {

            if (angular.isUndefined(value)) {

                $scope.variable.value = undefined;
            }
        });
    }
]);


