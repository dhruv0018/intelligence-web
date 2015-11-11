import BLACKLISTED_ERRORS from './blacklisted-errors';
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

                        alerts.add({

                            type: 'warning',
                            message: response.data.userMessage
                        });

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

                        //Check if the url is a blacklisted url or a wildcard url
                        //and if so, do not show alert message
                        if(!isBlacklisted(response) && !isWildcard(response)) {

                            ErrorReporter.reportError(new Error('Server error', response.data));

                            alerts.add({

                                type: 'danger',
                                message: 'Server Error'
                            });
                        }

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

        //Check if the url is a blacklisted url
        function isBlacklisted(response, path = null) {

            if(!path) {
                path = $location.$$path;
            }
            let method = response.config.method;
            let blacklisted = BLACKLISTED_ERRORS[response.status] === undefined ||
                                    BLACKLISTED_ERRORS[response.status][path] === undefined ||
                                    BLACKLISTED_ERRORS[response.status][path][method] === undefined ||
                                    BLACKLISTED_ERRORS[response.status][path][method] !== true;

            return !blacklisted;
        }

        //Check if the url is a wildcard url and if so if it is blacklisted
        function isWildcard(response) {

            let path = getWildcardUrl($location.$$path);

            return isBlacklisted(response, path);
        }

        //Take a url and convert it to a wildcard url
        function getWildcardUrl(url) {

            let pairs = url.substring(url.indexOf('/') + 1).split('/');
            let wildcardUrl = '';
            if(pairs.length) {
                pairs.forEach((pair)=>{
                    if(!isNaN(pair)) {
                        pair = '*';
                    }
                    wildcardUrl += '/' + pair;
                });
            }

            return wildcardUrl;
        }

    }
]);

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.interceptors.push('Error.Interceptor');
    }
]);
