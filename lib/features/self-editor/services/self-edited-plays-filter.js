const dependencies = [

];

const SelfEditedPlaysFilter = window.angular.module('SelfEditedPlaysFilter', dependencies);

/**
 * Event service for filtering self-edited plays
 * @module SelfEditedPlaysFilter
 */
SelfEditedPlaysFilter.service('SelfEditedPlaysFilter', [
    '$rootScope',
    function(
        $rootScope
    ) {

        this.notifySelectedFilter = function(filter) {

            $rootScope.$broadcast('self-edited-plays-filter-selected', filter);
        };

        this.notifyFiltersCleared = function() {

            $rootScope.$broadcast('self-edited-plays-filter-cleared');
        };
    }
]);

export default SelfEditedPlaysFilter;
