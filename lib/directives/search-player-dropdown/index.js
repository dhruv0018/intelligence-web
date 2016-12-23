import SearchPlayerDropdownController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SearchPlayerDropdown
 * @module SearchPlayerDropdown
 */
const SearchPlayerDropdown = angular.module('SearchPlayerDropdown', [
    'ui.bootstrap.dropdown'
]);

/**
 * SearchPlayerDropdown directive.
 * @module SearchPlayerDropdown
 * @name SearchPlayerDropdown
 * @type {directive}
 */
SearchPlayerDropdown.directive('searchPlayerDropdown', [
    function directive() {

        const SearchPlayerDropdown = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/search-player-dropdown/template.html',

            controller: SearchPlayerDropdownController,

            scope: {
                players: '=',
                selectedPlayer: '=?ngModel',
                onSelect: '=?',
                filterCriteria: '@',
                label: '@?',
                team: '=',
                includeActiveInactiveFilters: '='
            }
        };

        return SearchPlayerDropdown;
    }
]);

export default SearchPlayerDropdown;
