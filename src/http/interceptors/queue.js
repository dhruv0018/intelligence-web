var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('QueueInterceptor', [
    '$q', '$location', 'AlertsService', 'TokensService', 'HTTPQueueService',
    function factory($q, $location, alerts, tokens, queue) {

        return {

            responseError: function(response) {

                switch (response.status) {

                case 400: /* Bad Request */
                case 401: /* Unauthorized */
                case 403: /* Forbidden */
                case 404: /* Not Found */
                case 405: /* Method Not Allowed */
                case 500: /* Server Error */

                    break;

                default:

                    return queue.enqueue(response);
                }

                return $q.reject(response);
            }
        };
    }
]);

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.interceptors.push('QueueInterceptor');
    }
]);

