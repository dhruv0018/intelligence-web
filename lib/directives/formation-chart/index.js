/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Formation Chart
 * @module Formation Chart
 */
var formationChart = angular.module('FormationChart', []);

/* Cache the template file */
formationChart.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('formation-chart.html', template);
    }
]);

/**
 * Formation Chart directive.
 * @module Formation Chart
 * @name Formation Chart
 * @type {Directive}
 */
formationChart.directive('formationChart', [
    function directive() {

        var formationchart = {

            restrict: TO += ELEMENTS,

            scope: {
                arenaType: '=',
                chart: '=',
                redzone: '='
            },

            templateUrl: 'formation-chart.html'

        };

        return formationchart;
    }
]);
