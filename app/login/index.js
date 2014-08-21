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

                onEnter: [
                    '$state', 'ROLES', 'AuthenticationService', 'SessionService',
                    function($state, ROLES, auth, session) {

                        if (auth.isLoggedIn) {

                            var currentUser = session.retrieveCurrentUser();

                            /* If the user has more than one role, but has not
                            * selected a default one yet. */
                            if (currentUser &&
                                currentUser.roles &&
                                currentUser.roles.length > 1 &&
                                !currentUser.defaultRole) {

                                $state.go('roles', false);

                            } else {

                                /* If the current user is a super admin or an admin. */
                                if (currentUser.is(ROLES.SUPER_ADMIN) || currentUser.is(ROLES.ADMIN)) {

                                    $state.go('users');
                                }

                                /* If the current user is an indexer. */
                                else if (currentUser.is(ROLES.INDEXER)) {

                                    $state.go('indexer-games');
                                }

                                /* If the current user is a coach. */
                                else if (currentUser.is(ROLES.COACH)) {

                                    $state.go('Coach.FilmHome');
                                }

                                /* If the current user an athlete. */
                                else if (currentUser.is(ROLES.ATHLETE)) {

                                    $state.go('Athlete.FilmHome');
                                }

                                else {

                                    $state.go('Account.ContactInfo');
                                }
                            }
                        }
                    }
                ]
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
    'config', '$rootScope', '$scope', '$state', '$stateParams', '$window', 'ROLES', 'AuthenticationService', 'SessionService',
    function controller(config, $rootScope, $scope, $state, $stateParams, $window, ROLES, auth, session) {

        $scope.config = config;

        var currentUser = session.retrieveCurrentUser();

        if (currentUser && currentUser.persist) {

            $scope.login = {};
            $scope.login.email = currentUser.email;
            $scope.login.remember = currentUser.persist;
        }

        $scope.submitLogin = function() {

            $scope.login.submitted = true;

            var email = $scope.login.email;
            var password = $scope.login.password;
            var persist = $scope.login.remember;

            /* Ensure any past login is cleared. */
            auth.logoutUser();

            /* Login the user. */
            auth.loginUser(email, password, persist).then(function(user) {

                if (user) {

                    /* If the user has more than one role, but has not selected
                     * a default one yet. */
                    if (user.roles && user.roles.length > 1 && !user.defaultRole) {

                        $state.go('roles', false);

                    } else {

                        /* If the user is a super admin or an admin. */
                        if (user.is(ROLES.SUPER_ADMIN) || user.is(ROLES.ADMIN)) {

                            $state.go('users');
                        }

                        /* If the user is an indexer. */
                        else if (user.is(ROLES.INDEXER)) {

                            $state.go('indexer-games');
                        }

                        /* If the user is a coach. */
                        else if (user.is(ROLES.COACH)) {

                            $state.go('Coach.FilmHome');
                        }

                        /* If the user is an athlete. */
                        else if (user.is(ROLES.ATHLETE)) {

                            $state.go('Athlete.FilmHome');
                        }

                        else {

                            $state.go('Account.ContactInfo');
                        }
                    }

                    user.lastAccessed = new Date().toISOString();
                    user.save();
                }

            }, function(error) {

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
            });
        };

        $scope.submitForgotPassword = function() {

            $scope.login.submitted = true;

            var email = $scope.$parent.login.email;

            auth.requestPasswordReset(email,

                function success() {

                    $scope.$parent.login = {};
                    $scope.$parent.login.submitted = false;

                    $state.go('login', {}, {

                        location: 'replace'

                    }).then(function() {

                        $rootScope.$broadcast('alert', {

                            type: 'info',
                            message: 'An email has been sent to ' + email + ' with further instructions'
                        });
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
                            message: 'There was a problem resetting your password'
                        });

                        throw new Error('Could not reset password');
                    }
                );
            }
        };
    }
]);

