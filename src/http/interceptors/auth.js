var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('Auth.Interceptor', [
    '$q', '$location', 'TokensService', 'HTTPQueueService',
    function factory($q, $location, tokens, queue) {

        return {

            /* Intercept responses with authentication error status codes. */
            responseError: function(response) {

                switch (response.status) {

                    case 401: /* Unauthorized */

                        /* Do not attempt a token refresh on any OAuth URLs. */
                        if (!/oauth/.test(response.config.url)) {

                            /* Refresh token. */
                            return tokens.refreshToken().then(function() {

                                /* Queue the original request to be re-requested. */
                                return queue.enqueue(response);
                            });
                        }
                }

                return $q.reject(response);
            }
        };
    }
]);

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.interceptors.push('Auth.Interceptor');
    }
]);

