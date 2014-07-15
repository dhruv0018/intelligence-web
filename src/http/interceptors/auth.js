var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('Auth.Interceptor', [
    '$q', '$location', 'TokensService',
    function factory($q, $location, tokens) {

        return {

            /* Intercept all responses. Includes any server responses that are
             * considered successful. Which are status codes up to the 400 level. */
            response: function(response) {
            /* jshint sub:true */
            /* jshint camelcase:false */

                if (response.data.error && response.data.error === 'invalid_token') {

                    ErrorReporter.reportError(new Error('Invalid access token'));

                    /* TODO: Don't go to login; refresh token. */
                    tokens.removeTokens();
                    $location.path('/login');

                    return $q.reject(response);
                }

                return response;
            },

            /* Intercept responses with status codes that indicate errors. */
            responseError: function(response) {

                switch (response.status) {

                case 401: /* Unauthorized */

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

        $httpProvider.interceptors.push('Auth.Interceptor');
    }
]);

