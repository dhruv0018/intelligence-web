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

        $templateCache.put('signup.html', require('./signup.html'));
        $templateCache.put('template.html', require('./template.html'));
        $templateCache.put('login.html', require('./login.html'));
        $templateCache.put('locked.html', require('./locked.html'));
        $templateCache.put('forgot.html', require('./forgot.html'));
        $templateCache.put('reset.html', require('./reset.html'));
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
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'main@root': {
                        templateUrl: 'template.html',
                        controller: 'LoginController'
                    },
                    'main@login': {
                        templateUrl: 'login.html',
                        controller: 'LoginController'
                    }
                },

                onEnter: function($state, AuthenticationService, SessionService) {

                    if (AuthenticationService.isLoggedIn) {

                        var currentUser = SessionService.retrieveCurrentUser();

                        /* If the user has more than one role, but has not
                         * selected a default one yet. */
                        if (currentUser &&
                            currentUser.roles &&
                            currentUser.roles.length > 1 &&
                            !currentUser.defaultRole) {

                            $state.go('roles', false);

                        } else {

                            $state.go('contact-info');
                        }
                    }
                }
            })

            .state('locked', {
                public: true,
                url: '',
                parent: 'login',
                views: {
                    'header@login': {
                        template: ''
                    },
                    'main@login': {
                        templateUrl: 'locked.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('forgot', {
                public: true,
                url: '^/forgot-password',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'main@login': {
                        templateUrl: 'forgot.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('reset', {
                public: true,
                url: '^/password-reset/:token',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'main@login': {
                        templateUrl: 'reset.html',
                        controller: 'LoginController'
                    }
                },

                onEnter: function($state, $stateParams) {

                    if (!$stateParams.token) {

                        throw new Error('No password reset token!');
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
    'config', '$rootScope', '$scope', '$state', '$stateParams', '$window', 'AuthenticationService',
    function controller(config, $rootScope, $scope, $state, $stateParams, $window, auth) {

        $scope.config = config;

        $scope.submitLogin = function() {

            $scope.login.submitted = true;

            var email = $scope.login.email;
            var password = $scope.login.password;
            var persist = $scope.login.remember;

            /* Ensure any past login is cleared. */
            auth.logoutUser();

            /* Login the user. */
            auth.loginUser(email, password, persist, function(error, user) {

                if (error) {

                    $scope.login.submitted = false;

                    /* Handle case where the API returns an error because the
                     * user is forbidden from logging in. */
                    if (error.name === 'ForbiddenError') {

                        $state.go('locked');
                    }

                    /* Handle case where the API returns an error because the
                     * user was not found in the system. */
                    else if (error.name === 'NotFoundError') {

                        $scope.login.email = '';
                        $window.form.email.focus();
                        $scope.form.email.$setValidity('notfound', false);
                    }

                    /* Handle case where the API returns an error because the
                     * user is not authorized. */
                    else if (error.name === 'NotAuthorizedError') {

                        $scope.login.password = '';
                        $window.form.password.focus();
                        $scope.form.password.$setValidity('password', false);
                    }

                    else throw error;
                }

                else if (user) {

                    /* If the user has more than one role, but has not selected
                     * a default one yet. */
                    if (user.roles && user.roles.length > 1 && !user.defaultRole) {

                        $state.go('roles', false);

                    } else {

                        $state.go('contact-info');
                    }
                }
            });
        };

        $scope.submitForgotPassword = function() {

            $scope.login.submitted = true;

            var email = $scope.$parent.login.email;

            auth.requestPasswordReset(email,

                function success() {

                    $scope.login.submitted = false;

                    $state.go('login');

                    $rootScope.$broadcast('alert', {

                        type: 'info',
                        message: 'An email has been sent to ' + email + ' with further instructions'
                    });
                },

                function error(data, status) {

                    $scope.login.submitted = false;

                    /* Handle case where the API returns an error because the
                     * user was not found in the system. */
                    if (status === 404) {

                        $scope.login.email = '';
                        $window.form.email.focus();
                        $scope.form.email.$setValidity('notfound', false);
                    }

                    else {

                        $rootScope.$broadcast('alert', {

                            type: 'danger',
                            message: 'Error requesting password reset for ' + email
                        });
                    }
                }
            );
        };

        $scope.submitResetPassword = function() {

            if ($stateParams.token) {

                auth.processPasswordReset($stateParams.token, $scope.reset.password,

                    function success(data, status) {

                        $scope.reset.submitted = false;

                        $scope.login = {};
                        $scope.login.email = data.email;
                        $scope.login.password = $scope.reset.password;

                        $scope.submitLogin();
                    },

                    function error(data, status) {

                        $rootScope.$broadcast('alert', {

                            type: 'danger',
                            message: 'There was a problem reseting your password'
                        });

                        throw new Error('Could not reset password');
                    }
                );
            }
        };
    }
]);

