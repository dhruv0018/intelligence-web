import StatsExportController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'stats-export.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * StatsExport
 * @module StatsExport
 */
const StatsExport = angular.module('StatsExport', [
    'ngMaterial',
    'ui.bootstrap.dropdown'
]);

/* Cache the template file */
StatsExport.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
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
