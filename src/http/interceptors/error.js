var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('Error.Interceptor', [
    '$q', '$location', 'ErrorReporter', 'AlertsService', 'TokensService',
    function factory($q, $location, ErrorReporter, alerts, tokens) {

        return {

            /* Intercept all responses. Includes any server responses that are
             * considered successful. Which are status codes up to the 400 level. */
            response: function(response) {
            /* jshint sub:true */
            /* jshint camelcase:false */

                /* Catch errors in 200 responses. */
                if (response.data.error) {

                    var error = new Error('Error response\n' +
                        response.data.error + ': ' +
                        response.data['error_description']);

                    ErrorReporter.reportError(error);

                    return $q.reject(response);
                }

                return response;
            },

            /* Intercept responses with status codes that indicate errors. */
            responseError: function(response) {

                switch (response.status) {

                case 405: /* Method Not Allowed */

                    ErrorReporter.reportError(new Error('Method not allowed', response.data));

                    alerts.add({

                        type: 'warning',
                        message: 'Method Not Allowed'
                    });

                    break;

                case 500: /* Server Error */

                    ErrorReporter.reportError(new Error('Server error', response.data));

                    alerts.add({

                        type: 'danger',
                        message: 'Server Error'
                    });

                    break;
                }

                return $q.reject(response);
            }
        };
    }
]);

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.interceptors.push('Error.Interceptor');
    }
]);

