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
                views: {
                    'header': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    },
                    'main': {
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
    '$scope', '$state', '$http', 'Users', 'AuthenticationService', 'TokenService',
    function controller($scope, $state, $http, users, auth, tokens) {

        $scope.login = function() {

            var oauth = new OAuth();

            var email = $scope.login.email;
            var password = $scope.login.password;

            /* TODO: Change to use logging framework */
            console.log('Attempt to login with:');
            console.log('  email: ' + $scope.login.email);
            console.log('  password: ' + $scope.login.password);
            console.log('Logging in...');



            oauth.getAccessToken(email, password, function(error, token) {

                if (error) {

                    /* Handle case where the API returns an error because the
                     * user is not authorized. In this case, the password field
                     * is cleared and the password is set to invalid. This is
                     * the only time the password is considered invalid. */
                    if (error.name === 'NotAuthorizedError') {

                        $scope.login.password = '';
                        window.form.password.focus();
                        $scope.form.password.$setValidity('wrongPassword', false);
                        $scope.$apply();
                        return;

                    }

                    else throw error;
                }

                $http.defaults.headers.common.Authorization = 'Bearer ' + token;

                tokens.setAccessToken(token);

                users.get({ id: email }, function(user) {

                    auth.loginUser(user);

                    if (auth.isLoggedIn()) {

                        /* TODO: Change to use logging framework */
                        console.log('Logged in');

                        var defaultRole = user.getDefaultRole();

                        /* If no default role, prompt user for role. */
                        $state.go(defaultRole ? 'account' : 'roles');
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

