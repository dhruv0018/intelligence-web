/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * toArray
 * @module toArray
 */
const toArray = angular.module('toArray.Filter', []);

/**
 * toArray filter.
 * @module toArray
 * @name toArray
 * @type {Filter}
 */

toArray.filter('toArray', [
    function () {
        return function (obj) {
            if (!obj) return obj;

            return Object.keys(obj).map(function (key) {
                return Object.defineProperty(obj[key], '$key', { enumerable: false, value: key});
            });
        };
    }
]);
