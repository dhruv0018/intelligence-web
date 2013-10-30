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
    '$rootScope', '$scope', '$state', 'ROLE_TYPE', 'UsersFactory', 'SessionService', 'AuthenticationService',
    function controller($rootScope, $scope, $state, ROLE_TYPE, users, session, auth) {

        $scope.auth = auth;
        $scope.user = session.currentUser;
        $scope.currentRole = session.currentUser ? session.currentUser.currentRole : null;

        $scope.$watch('currentRole', function(role) {

            if (auth.isLoggedIn) {

                $scope.isAdmin = $scope.currentRole.type.id == ROLE_TYPE.ADMIN;
                $scope.isSuperAdmin = $scope.currentRole.type.id == ROLE_TYPE.SUPER_ADMIN;
            }
        });

        $scope.switchRole = function(role) {

            $scope.currentRole = role;
            session.currentUser.currentRole = role;
            session.currentUser.setDefaultRole(role);
            session.currentUser.save();
        };

        $scope.account = function() {

            $state.go('account');
        };

        $scope.logout = function() {

            auth.logoutUser();
            $state.go('root');
        };
    }
]);

