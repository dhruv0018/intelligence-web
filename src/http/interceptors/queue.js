var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Intercepts error responses.
 */
IntelligenceWebClient.factory('QueueInterceptor', [
    '$q', 'HTTPQueueService',
    function factory($q, queue) {

        return {

            responseError: function(response) {

                if (response.status < 300) {

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

