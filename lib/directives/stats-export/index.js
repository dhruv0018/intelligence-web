import StatsExportController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/stats-export/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * StatsExport
 * @module StatsExport
 */
const StatsExport = angular.module('StatsExport', [
    'ui.bootstrap.dropdown'
]);

/**
 * StatsExport directive.
 * @module StatsExport
 * @name StatsExport
 * @type {directive}
 */
StatsExport.directive('statsExport', [
    function directive() {

        const StatsExport = {

            restrict: TO += ELEMENTS,

            templateUrl,

            controller: StatsExportController,

            scope: {
                teams: '=',
                game: '='
            }
        };

        return StatsExport;
    }
]);

export default StatsExport;
