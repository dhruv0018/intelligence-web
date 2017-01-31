import controller from './controller';
/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/arena-chart-filters/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaChartFilters
* @module ArenaChartFilters
*/
const ArenaChartFilters = angular.module('ArenaChartFilters', []);

/**
* ArenaChartFilters directive.
* @module ArenaChartFilters
* @name ArenaChartFilters
* @type {Directive}
*/

ArenaChartFiltersDirective.$inject = [
];

function ArenaChartFiltersDirective(
) {

    let arenaChartFilters = {

        restrict: TO += ELEMENTS,

        templateUrl,

        scope: {
            filterModel: '='
        },

        controller
    };

    return arenaChartFilters;
}

ArenaChartFilters.directive('arenaChartFilters', ArenaChartFiltersDirective);

export default ArenaChartFilters;
