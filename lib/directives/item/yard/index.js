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
    function directive() {

        var Yard = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '=',
                autoAdvance: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.variable = {
                value: null
            };

            $scope.$watch('variable.value', function(value) {

                if (value && value.length > 1) {

                    $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                    $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                }
            });
        }

        return Yard;
    }
]);

