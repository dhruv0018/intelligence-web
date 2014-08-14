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
    function directive() {

        var Text = {

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

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.reset = function() {

                $scope.event.activeEventVariableIndex = $scope.item.index;
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

