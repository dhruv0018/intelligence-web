/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Login module for managing user logins.
 * @module Login
 */
var Login = angular.module('login', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Login.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('login.html', template);
    }
]);

/**
 * Login state router. Router for the login related routes. Uses AngularUI
 * UI-Router.
 * @module Login
 * @type {UI-Router}
 */
Login.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('login', {
                url: '/login',
                parent: 'root',
                views: {
                    'main@': {
                        templateUrl: 'login.html',
                        controller: 'LoginController'
                    }
                }
            });
    }
]);

/**
 * Login controller. Controller to delegate login actions.
 * @module Login
 * @name LoginController
 * @type {Controller}
 */
Login.controller('LoginController', [
    '$scope', '$state', 'AuthenticationService',
    function controller($scope, $state, auth) {

        /* If the password field is updated, then immediately trust the
        * validity of the password again. */
        $scope.$watch('login.password', function() {

            var password = $scope.login.password;

            if (password && password.length) {

                $scope.form.password.$setValidity('password', true);
            }
        });

        $scope.login = function() {

            var email = $scope.login.email;
            var password = $scope.login.password;
            var persist = $scope.login.remember;

            /* TODO: Change to use logging framework */
            console.log('Attempt to login with:');
            console.log('  email: ' + $scope.login.email);
            console.log('  password: ' + $scope.login.password);
            console.log(persist ? 'Persisting' : 'Not persisting');
            console.log('Logging in...');

            /* Ensure past login is cleared. */
            auth.logoutUser();

            auth.loginUser(email, password, persist, function(error, user) {

                if (error) return handleError(error);

                /* TODO: Change to use logging framework */
                console.log('Logged in');

                /* If the user already has a default role, or
                * they only have a single role, go to their account */
                if (user.defaultRole || user.roles.length === 1) {

                    $state.go('account');
                }

                /* If no default role, prompt user for role. */
                else {

                    $state.go('roles', false);
                }
            });

            var handleError = function(error) {

                /* Handle case where the API returns an error because the
                * user is not authorized. In this case, the password field
                * is cleared and the password is set to invalid. This is
                * the only time the password is considered invalid. */
                if (error.name === 'NotAuthorizedError') {

                    $scope.login.password = '';
                    window.form.password.focus();
                    $scope.form.password.$setValidity('password', false);
                }

                else throw error;
            };
        };
    }
]);

