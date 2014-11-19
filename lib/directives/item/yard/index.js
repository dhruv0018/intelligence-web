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

            replace: true,

            scope: {
                item: '=',
                event: '=',
                autoAdvance: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.variable = {};

            var currentUser = session.currentUser;

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);
            $scope.isReset = false;

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
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

        return Yard;
    }
]);

