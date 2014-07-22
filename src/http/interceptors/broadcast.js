var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Intercepts and broadcasts HTTP requests and responses.
 */
IntelligenceWebClient.factory('Broadcast.Interceptor', [
    '$rootScope', '$q',
    function factory($rootScope, $q) {

        return {

            request: function(config) {

                $rootScope.$broadcast('httpRequest', config);
                return config;
            },

            requestError: function(rejection) {

                $rootScope.$broadcast('httpRequestError', rejection);
                return $q.reject(rejection);
            },

            response: function(response) {

                $rootScope.$broadcast('httpResponse', response);
                return response;
            },

            responseError: function(rejection) {

                $rootScope.$broadcast('httpResponseError', rejection);
                return $q.reject(rejection);
            }
        };
    }
]);

IntelligenceWebClient.config([
    '$httpProvider',
    function($httpProvider) {

        $httpProvider.interceptors.push('Broadcast.Interceptor');
    }
]);

