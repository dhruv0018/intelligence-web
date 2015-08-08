/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
import ArenaChartDataDependencies from './data';
import controller from './controller';
import template from './template.html';
let templateUrl = 'ArenaChart.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* ArenaChart
* @module ArenaChart
*/
const ArenaChart = angular.module('ArenaChart', []);

/* Cache the template file */
ArenaChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

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

        scope: {},

        controllerAs: 'arenaChartController',

        controller
    };

    return arenaChart;
}

ArenaChart.directive('arenaChart', ArenaChartDirective);
ArenaChart.factory('ArenaChartDataDependencies', ArenaChartDataDependencies);

export default ArenaChart;
