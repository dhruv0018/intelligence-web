var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('Error.Interceptor', [
    '$q', '$location', 'ErrorReporter', 'AlertsService',
    function factory($q, $location, ErrorReporter, alerts) {

        return {

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

