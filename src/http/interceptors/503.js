var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('503.Interceptor', [
    '$q', '$injector',
    function factory($q, $injector) {

        return {

            /* Intercept responses with 503 error status codes. */
            responseError: function(response) {

                $injector.invoke([
                    '$state',
                    function($state) {

                        switch (response.status) {

                            case 503: /* Temporarily Unavailable */

                                $state.go('maintenance');
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

        $httpProvider.interceptors.push('503.Interceptor');
    }
]);
