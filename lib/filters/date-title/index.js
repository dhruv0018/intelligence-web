var angular = window.angular;

/**
 * dateTitle
 * Filter to consistently display date in the same abbreviated format.
 * @module dateTitle
 */
var DateTitle = angular.module('DateTitle.Filter', []);

/**
 * DateTitle filter.
 * @module DateTitle
 * @name DateTitle
 * @type {Filter}
 */

DateTitle.filter('dateTitle', ['$filter',
    function($filter) {

        return function(dateStr) {

            if (angular.isDefined(dateStr)) {

                return $filter('date')(dateStr, 'MMM d, yyyy');
            } else {

                throw new Exception('Attempted to utilize Date.Filter without an expression');
            }
        };
    }
]);
