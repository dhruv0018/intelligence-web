var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var moment = require('moment');

var IntelligenceWebClient = angular.module(pkg.name);

/* Regular expression for ISO 8601 dates. */
var ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z|\+\d{2}:\d{2})/;

/**
 * Transform dates.
 * Transforms all dates in data to Javascript objects in UTC.
 * @param {String|Object} data - a string or object to transform.
 * @returns {Object} - data with dates transformed.
 */
function transformToDates(data) {

    /* Use angular JSON methods to strip out angular properties. */
    data = angular.toJson(data);
    data = angular.fromJson(data);

    /* For every value in the data. */
    angular.forEach(data, function(value, key) {

        /* If the value is a string. */
        if (angular.isString(value)) {

            /* Look in the value for a match to the ISO regular expression. */
            var match = value.match(ISO8601_REGEX);

            /* If there is a match. */
            if (match) {

                /* Convert the string to a UTC moment. */
                var date = moment.utc(match[0]);

                /* If the date is valid. */
                if (date.isValid()) {

                    /* Covert the date to a Javascript date object. */
                    data[key] = date.toDate();
                }
            }
        }

        /* If the value is an object. */
        else if (angular.isObject(value)) {

            /* Recursively transform the object. */
            return transformToDates(value);
        }
    });

    return data;
}

IntelligenceWebClient.factory('TransformDates', [
    function() {

        var TransformDates = {

            transformToDates: transformToDates
        };

        return TransformDates;
    }
]);

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.defaults.transformResponse.push(transformToDates);
    }
]);

