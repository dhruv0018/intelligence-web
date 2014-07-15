var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

var ISO8601_REGEX = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

function transformToDate(data) {

    if (angular.isObject(data)) {

        Object.keys(data).forEach(function(key) {

            var value = data[key];

            if (angular.isString(value)) {

                var match = value.match(ISO8601_REGEX);

                if (match) {

                    var date = new Date(match[0]);

                    if (isFinite(date)) data[key] = date;
                }
            }

            else if (angular.isObject(value)) {

                return transformToDate(value);
            }
        });
    }

    return data;
}

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.defaults.transformResponse.push(transformToDate);
    }
]);

