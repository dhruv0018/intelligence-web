/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Height
 * @module Height
 */
var Height = angular.module('Height.Filter', []);

/**
 * Height filter.
 * @module Height
 * @name Height
 * @type {Filter}
 */

Height.filter('height', [
    function() {

        return function(height) {

            if (angular.isDefined(height)) {

                return Math.floor(height / 12) + '\'' + (height % 12) + '"';
            } else {

                throw new Exception('Attempted to utilize Height.Filter without an expression');
            }
        };
    }
]);

Height.filter('inchesAsFeet' , [
    function() {
        return function(height) {
            return Math.floor(height / 12);
        };
    }
]);

Height.filter('remainingInchesFromFeetConversion', [
    function() {
        return function(height) {
            return height % 12;
        };
    }
]);
