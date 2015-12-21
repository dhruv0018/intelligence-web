var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('Auth.Interceptor', [
    '$q', '$injector',
    function factory($q, $injector) {

        return {

            /* Intercept responses with authentication error status codes. */
            responseError: function(response) {

                $injector.invoke([
                    'TokensService', 'HTTPQueueService',
                    function(tokens, queue) {

                        switch (response.status) {

                            case 401: /* Unauthorized */

                                /* Do not attempt a token refresh on any OAuth URLs. */
                                if (!/oauth/.test(response.config.url)) {

                                    /* Refresh token. */
                                    return tokens.refreshToken().then(function() {

                                        // reset Authorization header
                                        if (response.config && response.config.headers) {
                                            response.config.headers.Authorization = tokens.getAuthorization();
                                        }

                                        /* Queue the original request to be re-requested. */
                                        return queue.enqueue(response);
                                    });
                                }
                        }
                    }
                ]);

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
