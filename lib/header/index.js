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
    '$rootScope', '$scope', '$state', 'Users', 'AuthenticationService',
    function controller($rootScope, $scope, $state, users, auth) {

        /* Retrieve the login state for the current user. */
        $scope.isLoggedIn = auth.isLoggedIn();

        /* Restrict the header to users who are logged in. */
        if ($scope.isLoggedIn) {

            var user = $rootScope.currentUser;

            $scope.name = user.firstName + ' ' + user.lastName;
        }

        $scope.logout = function() {

            auth.logoutUser();
            $state.go('root');
        };
    }
]);

