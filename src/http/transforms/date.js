var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var moment = require('moment');

var IntelligenceWebClient = angular.module(pkg.name);

var ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z|\+\d{2}:\d{2})/;

function transformToDates(data) {

    angular.forEach(data, function(value, key) {

        if (angular.isString(value)) {

            var match = value.match(ISO8601_REGEX);

            if (match) {

                var date = moment.utc(match[0]);

                if (date.isValid()) {

                    data[key] = date.toDate();
                }
            }
        }

        else if (angular.isObject(value)) {

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

