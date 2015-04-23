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

function inchesAsFeet (height) {
    return Math.floor(height / 12);
}

function inchesAsFeetFilter () {
    return inchesAsFeet;
}

Height.filter('inchesAsFeet', inchesAsFeetFilter);

export {inchesAsFeet};

function remainingInchesFromFeetConversion (height) {
    return height % 12;
}

function remainingInchesFromFeetConversionFilter () {
    return remainingInchesFromFeetConversion;
}

Height.filter('remainingInchesFromFeetConversion', remainingInchesFromFeetConversionFilter);

export {remainingInchesFromFeetConversion};
