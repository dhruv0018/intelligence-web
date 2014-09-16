/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Positions Dropdown
 * @module Positions Dropdown
 */
var positionsDropdown = angular.module('positionsDropdown', [
    'ui.router',
    'ui.bootstrap',
    'ui.multiselect'
]);

/* Cache the template file */
positionsDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('positions-dropdown/template.html', require('./template.html'));
        $templateCache.put('positions-dropdown/positions-dropdown.html', require('./positions-dropdown.html'));
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

            templateUrl: 'positions-dropdown/template.html',

            scope: {
                positionset: '=',
                player: '=',
                ngModel: '='
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

        $scope.positions = $scope.positionset.positions;

        if ($scope.ngModel && $scope.ngModel.length) {

            //Populate position options in dropdown
            angular.forEach($scope.positions, function(position) {

                position.checked = !!~$scope.ngModel.indexOf(position.id);
            });
        }
    }
]);
