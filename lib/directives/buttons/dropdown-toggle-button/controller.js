/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * DropdownToggleButton
 * @module DropdownToggleButton
 */
const DropdownToggleButton = angular.module('DropdownToggleButton');

/**
 * DropdownToggleButton dependencies
 */
DropdownToggleButtonController.$inject = [
    '$scope'
];

/**
 * DropdownToggleButton controller.
 * @module DropdownToggleButton
 * @name DropdownToggleButton
 * @type {controller}
 */
function DropdownToggleButtonController (
    $scope
) {
    $scope.toggle = {
        icons: {
            current: 'keyboard_arrow_down',
            collapsed: 'keyboard_arrow_down',
            expanded: 'keyboard_arrow_up'
        },
        visibility: function visibility() {
            // Toggling element visibility
            $scope.toggledElement.classList.toggle('collapsed');
            $scope.toggledElement.classList.toggle('expanded');
            // Toggling element animations
            $scope.toggledElement.classList.toggle('fadeIn');
            $scope.toggledElement.classList.toggle('fadeOut');

            // Toggling button icon
            this.icons.current = (this.icons.current === this.icons.collapsed) ? this.icons.expanded : this.icons.collapsed;
        }
    };
}

DropdownToggleButton.controller('DropdownToggleButton.Controller', DropdownToggleButtonController);

export default DropdownToggleButtonController;
