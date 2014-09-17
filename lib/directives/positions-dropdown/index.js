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
                selectedPositions: '=ngModel'
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

        if ($scope.selectedPositions && $scope.selectedPositions.length) {

            /* Populate positions in dropdown. */
            angular.forEach($scope.positions, function(position) {

                /* Mark the position checked in the dropdown if its in the
                 * selected positions. */
                position.checked = !!~$scope.selectedPositions.indexOf(position.id);
            });
        }
    }
]);
