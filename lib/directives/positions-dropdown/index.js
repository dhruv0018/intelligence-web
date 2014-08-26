/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Positions Dropdown
 * @module Positions Dropdown
 */
var positionsDropdown = angular.module('positionsDropdown', [
    'ui.router',
    'ui.bootstrap',
    'multi-select'
]);

/* Cache the template file */
positionsDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('positions-dropdown.html', template);
    }
]);

/**
 * Positions Dropdown directive.
 * @module Positions Dropdown
 * @name Positions Dropdown
 * @type {Directive}
 */
positionsDropdown.directive('positionsDropdown', [
    function directive() {

        var positionsDropdown = {

            restrict: TO += ELEMENTS,

            templateUrl: 'positions-dropdown.html',

            scope: {
                positions: '=',
                player: '='
            },

            link: function(scope, element, attrs) {
            },
            controller: 'positionsDropdown.controller'
        };

        return positionsDropdown;
    }
]);

/**
 * Positions Dropdown controller
*/
positionsDropdown.controller('positionsDropdown.controller', [
    '$scope',
    function controller($scope) {
        $scope.dropdownOptions = [];
        $scope.$watch('positions', function(positions) {
            angular.forEach(positions, function(position) {
                this.push(position);
            }, $scope.dropdownOptions);
        });
    }
]);
