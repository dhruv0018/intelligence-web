import CustomTagsDropdownController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'custom-tags-dropdown.html';

/* Component resources */
const template = require('./template.html');

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

/* Cache the template file */
CustomTagsDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
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
                plays: '='
            }
        };

        return customTagsDropdown;
    }
]);
