/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Plan
 * @module Plan
 */
var Plan = angular.module('plan', []);

/**
 * Plan directive.
 * @module Plan
 * @name Plan
 * @type {Directive}
 */
Plan.directive('krossoverPlan', [
    'TURNAROUND_TIME_MIN_TIME_LOOKUP',
    function directive(TURNAROUND_TIME_MIN_TIME_LOOKUP) {

        function link($scope, el, at) {

            $scope.TURNAROUND_TIME_MIN_TIME_LOOKUP = TURNAROUND_TIME_MIN_TIME_LOOKUP;
        }

        var plan = {

            scope: {
                activePlan: '=',
                activePackage: '='
            },

            restrict: TO += ELEMENTS + ATTRIBUTES,

            templateUrl: 'lib/directives/plan/template.html',

            link: link
        };

        return plan;
    }
]);

export default Plan;
