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

                if (!response || !response.config) return $q.reject(response);

                var data = response.config.data;
                var method = response.config.method;
                var description = '';

                switch (method) {

                    case 'POST':
                        method = 'create';
                        break;

                    case 'PUT':
                        method = 'update';
                        break;

                    case 'DELETE':
                        method = 'delete';
                        break;
                }

                if (data && data.description) {

                    description = data.description.slice(0, -1);
                }

                switch (response.status) {

                    case 400: /* Bad Request */

                        ErrorReporter.reportError(new Error('Bad Request', response.data));

                        if (response && response.data && response.data.userMessage) {
                            alerts.add({

                                type: 'warning',
                                message: response.data.userMessage
                            });
                        }
                        break;

                    case 401: /* Not Authorized */
                    case 403: /* Forbidden */
                    case 404: /* Not Found */

                        break;

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

                    default:

                        ErrorReporter.reportError(new Error('Request error', response.data));

                        alerts.add({

                            type: 'danger',
                            message: 'Could not ' + method + ' ' + description
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
