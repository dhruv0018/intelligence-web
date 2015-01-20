var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('Utilities', [
    function() {

        /**
         * Builds a unique array of numbers.
         * @param {Array.<Number>} [array] - an array of numbers.
         * @returns {Array.<Number>} - an array of unique numbers.
         */
        this.unique = function(array) {

            var numbers = array.map(function(id) {

                return Number(id);
            });

            var valid = numbers.filter(function(id) {

                return id > 0 && !isNaN(id);
            });

            var unique = valid.reduce(function(previous, current) {

                if (!~previous.indexOf(current)) previous.push(current);

                return previous;

            }, []);

            return unique;
        };
    }
]);

