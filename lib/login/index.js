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
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'center@': {
                        templateUrl: 'template.html',
                        controller: 'LoginController'
                    },
                    'main@login': {
                        templateUrl: 'login.html',
                        controller: 'LoginController'
                    }
                },

                onEnter: function($state, AuthenticationService, SessionService) {

                    var currentUser = SessionService.retrieveCurrentUser();

                    if (AuthenticationService.isLoggedIn) {

                        if (currentUser && currentUser.isActive === true) {

                            /* Users must have at least one role to login. */
                            if (currentUser.roles && currentUser.roles.length > 0) {

                                /* If the user already has a default role, or
                                 * they only have a single role, go to their account */
                                if (currentUser.defaultRole || currentUser.roles.length === 1) {

                                    $state.go('account');
                                }

                                /* If no default role, prompt user for role. */
                                else {

                                    $state.go('roles', false);
                                }
                            }

                            /* If a user has no roles, then they can not login and their
                             * account is considered locked. */
                            else {

                                $state.go('locked');
                            }
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

        /* If the email field is updated, then immediately trust the
         * validity of the email again. */
        $scope.$watch('login.email', function() {

            var email = $scope.login.email;

            if (email && email.length) {

                $scope.form.email.$setValidity('notfound', true);
            }
        });

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

            /* Ensure any past login is cleared. */
            auth.logoutUser();

            /* Login the user. */
            auth.loginUser(email, password, persist, function(error, user) {

                if (error) {

                    /* Handle case where the API returns an error because the
                     * user is not authorized. */
                    if (error.name === 'NotAuthorizedError') {

                        $scope.login.password = '';
                        window.form.password.focus();
                        $scope.form.password.$setValidity('password', false);
                    }

                    /* Handle case where the API returns an error because the
                     * user is forbidden from logging in. */
                    else if (error.name === 'ForbiddenError') {

                        $state.go('locked');
                    }

                    /* Handle case where the API returns an error because the
                     * user was not found in the system. */
                    else if (error.name === 'NotFoundError') {

                        $scope.form.email.$setValidity('notfound', false);
                    }

                    else throw error;
                }

                else if (user && user.isActive === true) {

                    /* Users must have at least one role to login. */
                    if (user.roles && user.roles.length > 0) {

                        /* If the user already has a default role, or
                         * they only have a single role, go to their account */
                        if (user.defaultRole || user.roles.length === 1) {

                            $state.go('account');
                        }

                        /* If no default role, prompt user for role. */
                        else {

                            $state.go('roles', false);
                        }
                    }

                    /* If a user has no roles, then they can not login and their
                     * account is considered locked. */
                    else {

                        $state.go('locked');
                    }
                }
            });
        };
    }
]);

