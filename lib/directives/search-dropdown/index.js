import SearchDropdownController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'search-dropdown.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SearchDropdown
 * @module SearchDropdown
 */
const SearchDropdown = angular.module('SearchDropdown', [
    'ui.bootstrap.dropdown'
]);

/* Cache the template file */
SearchDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * SearchDropdown directive.
 * @module SearchDropdown
 * @name SearchDropdown
 * @type {directive}
 */
SearchDropdown.directive('searchDropdown', [
    function directive() {

        const SearchDropdown = {

            restrict: TO += ELEMENTS,

            templateUrl,

            controller: SearchDropdownController,

            scope: {
                options: '=',
                selectedOption: '=?ngModel',
                onSelect: '=?',
                filterCriteria: '@',
                optionLabel: '@?'
            }
        };

        return SearchDropdown;
    }
]);
