/* Component dependencies */
var OAuth = require('oauth');

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
                public: true,
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
    '$rootScope', '$scope', '$state', '$http', 'UsersFactory', 'SessionService', 'AuthenticationService', 'TokenService',
    function controller($rootScope, $scope, $state, $http, users, session, auth, tokens) {

        /* If the password field is updated, then immediately trust the
        * validity of the password again. */
        $scope.$watch('login.password', function() {

            var password = $scope.login.password;

            if (password && password.length) {

                $scope.form.password.$setValidity('password', true);
            }
        });

        $scope.login = function() {

            var oauth = new OAuth();

            var email = $scope.login.email;
            var password = $scope.login.password;

            /* TODO: Change to use logging framework */
            console.log('Attempt to login with:');
            console.log('  email: ' + $scope.login.email);
            console.log('  password: ' + $scope.login.password);
            console.log('Logging in...');

            /* Make sure that both email and password are present before sending
             * login request to API, if not then cancel the request. However,
             * the submit button is disabled if they are missing, so this case
             * should never be met. */
            if (!email || !password) {

                if (!email) throw new Error('Missing email');
                if (!password) throw new Error('Missing password');
            }

            oauth.getAccessToken(email, password, function(error, token) {

                if (error) {

                    /* Handle case where the API returns an error because the
                     * user is not authorized. In this case, the password field
                     * is cleared and the password is set to invalid. This is
                     * the only time the password is considered invalid. */
                    if (error.name === 'NotAuthorizedError') {

                        $scope.login.password = '';
                        window.form.password.focus();
                        $scope.form.password.$setValidity('password', false);
                        $scope.$apply();
                        return;

                    }

                    else throw error;
                }

                tokens.setAccessToken(token);

                users.get(email, function(user) {

                    auth.loginUser(user);

                    if (auth.isLoggedIn) {

                        /* TODO: Change to use logging framework */
                        console.log('Logged in');

                        /* Get the users default role, in any. */
                        var defaultRole = user.getDefaultRole();

                        /* If the user only has one role, then use it for
                         * their current one. */
                        if (user.roles.length === 1)
                            user.currentRole = user.roles[0];

                        /* If the user has a default role defined, then use it
                         * for their current one. */
                        if (defaultRole)
                            user.currentRole = defaultRole;

                        /* Store the user in the session. */
                        session.currentUser = user;

                        /* If the user already has a default role, or
                         * they only have a single role, go to their account */
                        if (defaultRole || user.roles.length === 1)
                            $state.go('account');

                        /* If no default role, prompt user for role. */
                        else $state.go('roles', false);
                    }
                });

                $scope.$apply();
            });
        };

        $scope.logout = function() {

            auth.logoutUser();
        };
    }
]);

