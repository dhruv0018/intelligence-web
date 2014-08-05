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
    function directive() {

        var Dropdown = {

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

            $scope.options = JSON.parse($scope.item.options);

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.reset = function() {

                $scope.event.activeEventVariableIndex = $scope.item.index;
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
            };
        }

        return Dropdown;
    }
]);

