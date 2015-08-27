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

const templateUrl = 'logout.html';
const template    = require('./template.html');

/* Cache the template file */
Logout.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
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
                        templateUrl: templateUrl,
                        controller: 'LogoutController'
                    }
                },
                onEnter: [
                    '$state', 'AuthenticationService',
                    function($state, auth) {

                        /* TODO: There's a bug with attempting to resolve this
                         * promise. Sometimes it hangs on the deleteDatabase()
                         * call preventing the promise from ever resolving and
                         * therefore never moving on to the 'login' state.
                         **/
                        // function logoutSuccess () {
                        //
                        //     $state.go('login');
                        // }
                        //
                        // function logoutError (err) {
                        //
                        //     throw new Error(err);
                        // }
                        //
                        // auth.logoutUser().then(logoutSuccess, logoutError);

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
