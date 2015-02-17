var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('Utilities', [
    function service() {

        /**
         * Builds a unique array of numbers.
         * @param {Array.<Number>} [array] - an array of numbers.
         * @returns {Array.<Number>} - an array of unique numbers.
         */
        this.unique = function unique(array) {

            var numbers = array.map(function map(id) {

                return Number(id);
            });

            var valid = numbers.filter(function filter(id) {

                return id > 0 && !isNaN(id);
            });

            var unique = valid.reduce(function reduce(previous, current) {

                if (!~previous.indexOf(current)) previous.push(current);

                return previous;

            }, []);

            return unique;
        };

        this.floor = function floor(num) {
            return Math.floor(num);
        };
    }
]);

