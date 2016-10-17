/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Weight
 * @module Weight
 */
var Weight = angular.module('Weight.Filter', []);

/**
 * Weight filter.
 * @module Weight
 * @name Weight
 * @type {Filter}
 */

Weight.filter('weight', [
    function() {

        return function(weight) {

            if (angular.isDefined(weight)) {

                return weight + 'lbs.';
            } else {

                throw new Exception('Attempted to utilize Weight.Filter without an expression');
            }
        };
    }
]);

export default Weight;
