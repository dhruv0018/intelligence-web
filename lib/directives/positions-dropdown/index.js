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
    'am.multiselect'
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

            templateUrl: 'lib/directives/positions-dropdown/template.html',

            scope: {
                positionset: '=',
                isActive: '=',
                selectedPositions: '=ngModel'
            },

            link: link,
            controller: 'positionsDropdown.controller'
        };

        function link($scope, element, attributes) {

            $scope.isOpen = false;
            var positionContainer = element[0].getElementsByClassName('positions-dropdown-container');

            $scope.$watch(function() {
                return angular.element(positionContainer).hasClass('open');
            }, function(open) {
                $scope.isOpen = open;
            });

            $scope.$watch('positionset', () => {
                $scope.positions = $scope.positionset.positions;

                $scope.indexedPositions = $scope.positionset.indexedPositions;

                if ($scope.selectedPositions && $scope.selectedPositions.length) {

                    /* Populate positions in dropdown. */
                    angular.forEach($scope.positions, function(position) {

                        /* Mark the position checked in the dropdown if its in the
                         * selected positions. */
                        position.checked = !!~$scope.selectedPositions.indexOf(position.id);
                    });
                }
            });
        }

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

export default positionsDropdown;
