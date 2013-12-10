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
 * Header state router.
 * @module IntelligenceWebClient
 * @type {UI-Router}
 */
IntelligenceWebClient.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('base', {
                url: '',
                parent: 'root',
                abstract: true,
                views: {
                    'header@root': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    }
                }
            });
    }
]);

/**
 * Header controller.
 * @module IntelligenceWebClient
 * @name HeaderController
 * @type {Controller}
 */
IntelligenceWebClient.controller('HeaderController', [
    '$scope', '$state', 'SessionService', 'AuthenticationService', 'ROLES',
    function controller($scope, $state, session, auth, ROLES) {

        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.currentUser = session.currentUser;

        $scope.switchRole = function(role) {

            $scope.currentUser.setDefaultRole(role);
            session.storeCurrentUser($scope.currentUser);
        };

        $scope.account = function() {

            $state.go('account');
        };

        $scope.logout = function() {

            auth.logoutUser();
            $state.go('login');
        };
    }
]);

