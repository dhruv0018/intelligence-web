/* FIXME: Event variable should be renamed to avoid collision with native Event */
/*jshint -W079 */

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/text.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Text
 * @module Text
 */
var Text = angular.module('Item.Text', []);

/* Cache the template file */
Text.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Text directive.
 * @module Text
 * @name Text
 * @type {Directive}
 */
Text.directive('krossoverItemText', [
    'ROLES', 'SessionService',
    function directive(ROLES, session) {

        var Text = {

            restrict: TO += ELEMENTS,
            controller: 'TextController',
            controllerAs: 'textController',
            templateUrl: templateUrl
        };

        return Text;
    }
]);

Text.controller('TextController', [
    '$scope', 'ROLES', 'SessionService',
    function textController($scope, ROLES, session) {

        $scope.isReset = false;

        $scope.onBlur = function() {
            $scope.isReset = false;
            if (!$scope.variable.value) {
                if ($scope.item.isRequired) {
                    $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                } else {
                    $scope.event.variableValues[$scope.item.id].value = null;
                }
            } else {
                $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
            }
        };

        $scope.$watch('event.variableValues[item.id].value', function(value) {

            if (angular.isUndefined(value)) {

                $scope.variable.value = undefined;
            }
        });
    }
]);

