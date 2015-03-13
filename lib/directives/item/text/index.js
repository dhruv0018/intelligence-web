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

            replace: true,

            scope: {
                item: '=',
                event: '=',
                autoAdvance: '=?',
                isEditable: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

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

            $scope.$watch('event.variableValues[item.id].value', function(value) {

                if (angular.isUndefined(value)) {

                    $scope.variable.value = undefined;
                }
            });
        }

        return Text;
    }
]);

