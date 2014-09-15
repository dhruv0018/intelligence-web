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
                player: '=',
                ngModel: '='
            },

            link: function(scope, element, attrs) {
                scope.dropdownOptions = [];
                scope.selectedPositions = [];
                //Populate position options in dropdown
                scope.$watch('positions', function(positions) {
                    angular.forEach(positions, function(position) {
                        scope.ngModel = angular.isArray(scope.ngModel) ? scope.ngModel : [];
                        position.ticked = !!~scope.ngModel.indexOf(position.id);
                        this.push(position);
                    }, scope.dropdownOptions);
                    scope.dropdownInput = angular.copy(scope.dropdownOptions);
                });

                scope.$watch('selectedPositions', function(positions) {
                    scope.ngModel = [];
                    angular.forEach(positions, function(position) {
                        this.push(position.id);
                    }, scope.ngModel);
                });
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
    }
]);
