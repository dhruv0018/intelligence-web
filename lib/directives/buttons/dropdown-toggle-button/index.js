/* Constants */
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'lib/directives/buttons/dropdown-toggle-button/template.html';

import DropdownToggleButtonController from './controller';
/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * DropdownToggleButton
 * @module DropdownToggleButton
 */
const DropdownToggleButton = angular.module('DropdownToggleButton', [
]);

/**
 * DropdownToggleButton directive.
 * @module DropdownToggleButton
 * @name DropdownToggleButton
 * @type {directive}
 */
DropdownToggleButton.directive('dropdownToggleButton', [
    function directive() {

        const dropdownToggleButton = {

            restrict: TO += ELEMENTS,

            scope: {
                toggledElement: '=',
                text: '=?'
            },

            controller: DropdownToggleButtonController,

            templateUrl: templateUrl,
        };

        return dropdownToggleButton;
    }
]);

export default DropdownToggleButton;
