var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('Utilities', [
    '$window',
    function service($window) {

        /**
         * Builds a unique array of numbers.
         * @param {Array.<Number>} [array] - an array of numbers.
         * @returns {Array.<Number>} - an array of unique numbers.
         */
        this.unique = function (array) {

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

        this.floor = function (num) {
            return Math.floor(num);
        };

        this.matchMedia = function (query, success, fail) {

            var mql = $window.matchMedia(query);

            var callback = function (mql) {

                if (mql.matches) {

                    if (success) {
                        success();
                    } else {
                        throw new Error('Tried to invoke an undefined success callback in Utilities.matchMedia');
                    }
                } else {

                    if (fail) {
                        fail();
                    } else {
                        throw new Error('Tried to invoke an undefined fail callback in Utilities.matchMedia');
                    }
                }
            };

            mql.addListener(callback);

            /* The listener only fires when the state of the window changes
             * so the callback must be invoked manually to ensure execution
             * on page-load.
             */
            callback(mql);
        };
    }
]);

