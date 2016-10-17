import CustomTagsDropdownController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/custom-tags-dropdown/template.html';


/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CustomTagsDropdown
 * @module CustomTagsDropdown
 */
const CustomTagsDropdown = angular.module('CustomTagsDropdown', [
    'ngMaterial',
    'ui.bootstrap.dropdown'
]);


/**
 * CustomTagsDropdown directive.
 * @module CustomTagsDropdown
 * @name CustomTagsDropdown
 * @type {directive}
 */
CustomTagsDropdown.directive('customTagsDropdown', [
    function directive() {

        const customTagsDropdown = {

            restrict: TO += ELEMENTS,

            templateUrl,

            controller: CustomTagsDropdownController,

            scope: {
                plays: '=',
                forSelfEditor: '=?',
                disabled: '='
            }

        };

        return customTagsDropdown;
    }
]);

export default CustomTagsDropdown;
