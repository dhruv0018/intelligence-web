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
    '$scope', '$state', '$window', 'AuthenticationService',
    function controller($scope, $state, $window, auth) {

        $scope.width = $window.outerWidth;

        angular.element($window).bind('resize',function(){

            $scope.width = $window.outerWidth;

            if ($scope.width < 800) {

                if ($scope.form) {

                    if ($scope.form.email &&
                        $scope.form.email.$dirty &&
                        $scope.form.email.$error &&
                        $scope.form.email.$error.required) {

                        $window.form.email.placeholder = 'Required!';
                    }

                    if ($scope.form.password &&
                        $scope.form.password.$dirty &&
                        $scope.form.password.$error &&
                        $scope.form.password.$error.required) {

                        $window.form.password.placeholder = 'Required!';
                    }
                }
            }

            else if ($scope.width >= 800) {

                $window.form.email.placeholder = 'Your Email';
                $window.form.password.placeholder = 'Password';
            }
        });

        $scope.$watch('form.email.$error', function(error) {

            if ($scope.width < 800 &&
                $scope.form &&
                $scope.form.email &&
                $scope.form.email.$dirty &&
                error.required &&
                !error.notfound) {

                $window.form.email.placeholder = 'Required!';
            }
        }, true);

        $scope.$watch('form.password.$error', function(error) {

            if ($scope.width < 800 &&
                $scope.form &&
                $scope.form.password &&
                $scope.form.password.$dirty &&
                error.required &&
                !error.password) {

                $window.form.password.placeholder = 'Required!';
            }
        }, true);

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

                        $window.form.email.focus();
                        $scope.form.email.$setValidity('notfound', false);

                        if ($scope.width < 800) {

                            $window.form.email.placeholder =
                                'We couldn’t find an account for ' +
                                $scope.login.email;
                            $scope.login.email = '';
                        }
                    }

                    /* Handle case where the API returns an error because the
                     * user is not authorized. */
                    else if (error.name === 'NotAuthorizedError') {

                        $scope.login.password = '';
                        $window.form.password.focus();
                        $scope.form.password.$setValidity('password', false);

                        if ($scope.width < 800) {

                            $window.form.password.placeholder =
                                'Wrong Password, try again.';
                        }
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

