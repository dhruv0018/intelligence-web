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

/* Cache the template file */
Logout.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('logout.html', require('./template.html'));
    }
]);

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
                        templateUrl: 'logout.html',
                        controller: 'LogoutController'
                    }
                },
                onEnter: [
                    '$state', 'AuthenticationService',
                    function($state, auth) {

                        function logoutSuccess () {

                            $state.go('login');
                        }

                        function logoutError (err) {

                            throw new Error(err);
                        }

                        auth.logoutUser().then(logoutSuccess, logoutError);
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
