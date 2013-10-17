/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Header
 * @module IntelligenceWebClient
 */
var IntelligenceWebClient = angular.module('intelligence-web-client');

/* Cache the template file */
IntelligenceWebClient.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('header.html', template);
    }
]);

/**
 * Header controller.
 * @module IntelligenceWebClient
 * @name HeaderController
 * @type {Controller}
 */
IntelligenceWebClient.controller('HeaderController', [
    '$rootScope', '$scope', '$state', 'AuthenticationService',
    function controller($rootScope, $scope, $state, auth) {

        $scope.auth = auth;
        $scope.user = $rootScope.currentUser;




        $scope.logout = function() {

            auth.logoutUser();
            $state.go('root');
        };
    }
]);

