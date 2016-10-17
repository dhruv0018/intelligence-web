import SearchDropdownController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SearchDropdown
 * @module SearchDropdown
 */
const SearchDropdown = angular.module('SearchDropdown', [
    'ui.bootstrap.dropdown'
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

            templateUrl: 'lib/directives/search-dropdown/template.html',

            controller: SearchDropdownController,

            scope: {
                options: '=',
                selectedOption: '=?ngModel',
                onSelect: '=?',
                filterCriteria: '@',
                hideSecondaryLabel: '@',
                optionLabel: '@?',
                secondaryLabel: '@?'
            }
        };

        return SearchDropdown;
    }
]);

export default SearchDropdown;
