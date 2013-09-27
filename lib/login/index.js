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
                templateUrl: 'login.html',
                controller: 'LoginController'
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
    '$scope', '$http',
    function controller($scope, $http ) {

        $scope.login = {};
        $scope.login.user = null;

        $scope.login = function() {

            /* TODO: Change to use logging framework */
            console.log('Attempt to login with:');
            console.log('  email: ' + $scope.login.email);
            console.log('  password: ' + $scope.login.password);
            console.log('Logging in...');

            var oauth = new OAuth();
            oauth.getAccessToken($scope.login.email, $scope.login.password, function(error) {

                if (error) throw error;

                /* TODO: Change to use logging framework */
                console.log('Logged in');

                var url = 'https://www.dev.krossover.com/intelligence/api/v1/users/123';

                /* TODO: Change to use logging framework */
                console.log('Attempting signed request to ' + url);

                oauth.signRequest(url, function(error, response) {

                    if (error) throw error;

                    /* TODO: Change to use logging framework */
                    console.log('Received response: ' + response);
                });

            });
        };

        $scope.logout = function() {

            auth.logoutUser();
        };
    }
]);

