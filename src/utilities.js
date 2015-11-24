var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('Utilities', [
    '$window', '$timeout', '$q',
    function service($window, $timeout, $q) {

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

        this.compareTimes = function (a, b) {

            return a.time - b.time;
        };

        this.compareStartTimes = function (a, b) {

            return a.startTime - b.startTime;
        };

        //generic padding function for any input which needs to be preceeded by a zero if it is less than 10
        this.padZero = function(input) {

            let castedInput = +input;
            return (castedInput < 10) ? ('0' + castedInput) : castedInput;
        };

        this.toFixedFloat = function(value, precision = 6) {

            return parseFloat(value.toFixed(precision));
        };

        this.getSortedArrayByIds = function(objectToSort, orderedIds) {
            // Takes an object type and an array of ids and gets objects of that type in the same order
            return orderedIds.map(id => objectToSort.get(id));
        };

        /**
         * @method debounce
         * @description Returns a function that when called, will invoke the passed in promise-based function after a period of wait,
         * unless the function is called again before the timer ends. The returned function resolves an existing promise immediately
         * when called so that it doesn't block.
         * @param {function} promiseBasedFunction A promise based function add debounce behavior to
         * @param {=number} wait A time to wait before executing the function, promiseBasedFunction.
         */
        this.promiseDebounce = function(promiseBasedFunction, wait = 2000) {

            let timerId;
            let deferred;

            function debouncedFunction() {

                // resolve to keep from blocking
                if (deferred) deferred.resolve();

                deferred = $q.defer();

                $timeout.cancel(timerId);

                timerId = $timeout(() => {

                    promiseBasedFunction.apply(this, arguments)
                    .then(result => {
                        return deferred.resolve(result);
                    }, (result) => {
                        return deferred.reject(result);
                    });

                }, wait);

                return deferred.promise;
            }

            return debouncedFunction.bind(this);
        };
    }
]);
