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

            /* TODO: Change to use logging framework */
            console.log('Attempt to login with:');
            console.log('  email: ' + $scope.login.email);
            console.log('  password: ' + $scope.login.password);
            console.log('Logging in...');

            var oauth = new OAuth();

            oauth.getAccessToken($scope.login.email, $scope.login.password, function(error, token) {

                if (error) throw error;

                $http.defaults.headers.common.Authorization = 'Bearer ' + token;

                tokens.setAccessToken(token);

                users.get({ id: $scope.login.email }, function(user) {

                    auth.loginUser(user);

                    if (auth.isLoggedIn()) {

                        var defaultRole = user.getDefaultRole();

                        /* TODO: Change to use logging framework */
                        console.log('Logged in');

                        /* If no default role, prompt user for role. */
                        if (! defaultRole) {
                            $state.go('roles');

                        } else {
                            $state.go('account');
                        }
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

