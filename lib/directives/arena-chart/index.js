/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
import ArenaChartDataDependencies from './data';
import controller from './controller';
let templateUrl = 'lib/directives/arena-chart/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaChart
* @module ArenaChart
*/
const ArenaChart = angular.module('ArenaChart', []);

/**
* ArenaChart directive.
* @module ArenaChart
* @name ArenaChart
* @type {Directive}
*/

function ArenaChartDirective(
) {

    let arenaChart = {

        restrict: TO += ELEMENTS,

        templateUrl,

        scope: {
            game: '='
        },

        controllerAs: 'arenaChartController',

        controller
    };

    return arenaChart;
}

ArenaChart.directive('arenaChart', ArenaChartDirective);
ArenaChart.factory('ArenaChartDataDependencies', ArenaChartDataDependencies);

export default ArenaChart;
