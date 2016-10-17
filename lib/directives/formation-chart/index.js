/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Formation Chart
 * @module Formation Chart
 */
var formationChart = angular.module('FormationChart', []);

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
                redzone: '=',
                plays: '=',
                teamId: '=',
                seasonId: '='
            },

            templateUrl: 'lib/directives/formation-chart/template.html'

        };

        return formationchart;
    }
]);

export default formationChart;
