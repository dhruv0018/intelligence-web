/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Logout module for managing user logouts.
 * @module Logout
 */
var Logout = angular.module('logout', [
    'ui.router',
    'ui.bootstrap'
]);

const LogoutTemplateUrl = 'app/logout/template.html';

/**
 * Logout state router.
 * @module Logout
 * @type {UI-Router}
 */
Logout.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('logout', {
                url: '/logout',
                views: {
                    'root': {
                        templateUrl: LogoutTemplateUrl,
                        controller: 'LogoutController'
                    }
                },
                onEnter: [
                    '$state', 'AuthenticationService',
                    function($state, auth) {

                        auth.logoutUser();
                        $state.go('login');
                    }
                ]
            });
    }
]);

/**
 * Logout controller.
 * @module Logout
 * @name LogoutController
 * @type {Controller}
 */
Logout.controller('LogoutController', [
    function controller() {

    }
]);
