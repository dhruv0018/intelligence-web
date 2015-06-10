/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Login module for managing user logins.
 * @module Login
 */
const Login = angular.module('login', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Login.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('signup.html', require('./signup.html'));
        $templateCache.put('template.html', require('./template.html'));
        $templateCache.put('maintenance.html', require('./maintenance.html'));
        $templateCache.put('login.html', require('./login.html'));
        $templateCache.put('locked.html', require('./locked.html'));
        $templateCache.put('forgot.html', require('./forgot.html'));
        $templateCache.put('reset.html', require('./reset.html'));
        $templateCache.put('new-user.html', require('./new-user.html'));
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

            .state('maintenance', {
                url: '^/maintenance',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'main@login': {
                        templateUrl: 'maintenance.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('login', {
                url: '/login',
                views: {
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'root': {
                        templateUrl: 'template.html',
                        controller: 'LoginController'
                    },
                    'main@login': {
                        templateUrl: 'login.html',
                        controller: 'LoginController'
                    }
                },

                onEnter: [
                    '$state', 'ROLES', 'AuthenticationService', 'SessionService', 'AccountService',
                    function ($state, ROLES, auth, session, account) {

                        if (auth.isLoggedIn) {

                            let currentUser = session.retrieveCurrentUser();

                            /* If the user has more than one role, but has not
                            * selected a default one yet. */
                            if (currentUser &&
                                currentUser.roles &&
                                currentUser.roles.length > 1 &&
                                !currentUser.defaultRole) {

                                $state.go('roles', false);

                            } else {

                                account.gotoUsersHomeState(currentUser);
                            }
                        }
                    }
                ]
            })

            .state('locked', {
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
                data: {

                    isResettingPassword: true
                },

                onEnter: ['$state', '$stateParams',
                    function resetOnEnter ($state, $stateParams) {

                        if (!$stateParams.token) {

                            throw new Error('No password reset token!');
                        }
                    }
                ]
            })

            .state('new', {
                url: '^/new-user/:token',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: 'signup.html'
                    },
                    'main@login': {
                        templateUrl: 'new-user.html',
                        controller: 'LoginController'
                    }
                },
                data: {

                    isNewUser: true
                },

                onEnter: ['$state', '$stateParams',
                    function newOnEnter ($state, $stateParams) {

                        if (!$stateParams.token) {

                            throw new Error('No new user token!');
                        }
                    }
                ]
            });
    }
]);

/**
 * Login controller. Controller to delegate login actions.
 * @module Login
 * @name LoginController
 * @type {Controller}
 */
Login.controller('LoginController', LoginController);

LoginController.$inject = [
    'config',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'ROLES',
    'AuthenticationService',
    'SessionService',
    'AccountService',
    'AlertsService',
    'UsersFactory',
    'AnalyticsService',
    'TermsDialog.Service',
    'EMAIL_REQUEST_TYPES',
    'MOBILE_APP_URLS'
];

function LoginController(
    config,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $window,
    ROLES,
    auth,
    session,
    account,
    alerts,
    users,
    analytics,
    TermsDialog,
    EMAIL_REQUEST_TYPES,
    MOBILE_APP_URLS
) {

    $scope.config          = config;
    $scope.MOBILE_APP_URLS = MOBILE_APP_URLS;

    let currentUser = session.retrieveCurrentUser();

    if (currentUser && currentUser.persist) {

        $scope.login = {};
        $scope.login.email = currentUser.email;
        $scope.login.remember = currentUser.persist;
    }

    if ($state.current.data && $state.current.data.isResettingPassword) {

        $scope.resetPassword = true;
    }

    if ($state.current.data && $state.current.data.isNewUser) {

        $scope.newUser = {
            password     : undefined,
            showPassword : true, // By default, show the new user's password
            agree        : false
        };
    }

    $scope.submitLogin = function submitLogin () {

        $scope.login.submitted = true;

        let email = $scope.login.email;
        let password = $scope.login.password;
        let persist = $scope.login.remember;

        /* Login the user. */
        auth.loginUser(email, password, persist).then(function(user) {
            if (user) {

                /* Track the event for MixPanel */
                analytics.track({
                    category : 'Login',
                    action   : 'Selected',
                    label    : 'SignIn'
                });

                /* Once successfully logged in, determine the user's home state.
                 * Then, track user in analytics (user may not have a default
                 * roll yet). Also, update the user's last accessed timestamp. */
                account.gotoUsersHomeState(user)
                .then(function saveUserData () {

                    /* Indentify the user for MixPanel */
                    analytics.identify();

                    /* Save user data */
                    user.lastAccessed = new Date().toISOString();
                    user.save();
                });
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

    $scope.submitForgotPassword = function submitForgotPassword () {

        $scope.login.submitted = true;

        let email = $scope.$parent.login.email;

        users.resendEmail(EMAIL_REQUEST_TYPES.FORGOTTEN_PASSWORD, null, email).then(

            function success() {

                $scope.$parent.login = {};
                $scope.$parent.login.submitted = false;

                $state.go('login', {}, {

                    location: 'replace'

                }).then(function() {

                    alerts.add({
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

                    alerts.add({
                        type: 'danger',
                        message: 'Error requesting password reset for ' + email
                    });
                }
            }

        );
    };

    $scope.submitResetPassword = function submitResetPassword () {

        $scope.reset.submitted = true;

        if ($stateParams.token) {

            let token    = $stateParams.token;
            let password = $scope.reset.password;

            users.passwordReset(token, password).then(

                function success(data, status) {

                    $scope.reset.submitted = false;

                    $scope.login          = {};
                    $scope.login.email    = data.email;
                    $scope.login.password = password;

                    $scope.submitLogin();
                },

                function error(data, status) {

                    $scope.reset.submitted = false;

                    alerts.add({
                        type: 'danger',
                        message: 'There was a problem resetting your password'
                    });

                    throw new Error('Could not reset password');
                }
            );
        }
    };

    /**
     * Upon first login, save the user's new password
     * @method submitNewUserPassword
     */
    $scope.submitNewUserPassword = function submitNewUserPassword () {

        $scope.newUser.submitted = true;

        if ($stateParams.token) {

            let token    = $stateParams.token;
            let password = $scope.newUser.password;

            users.passwordReset(token, password).then(

                function success(data, status) {

                    $scope.newUser.submitted = false;

                    $scope.login          = {};
                    $scope.login.email    = data.email;
                    $scope.login.password = password;

                    $scope.submitLogin();
                },

                function error(data, status) {

                    $scope.newUser.submitted = false;

                    alerts.add({
                        type: 'danger',
                        message: 'There was a problem setting your new password'
                    });

                    throw new Error('Could not set new password');
                }
            );
        }
    };

    /**
     * Show the Terms & Conditions modal.
     * @method showTerms
     * @param {Object} Click event object to prevent propagation. Clicking terms
     * link toggles check box otherwise.
     */
    $scope.showTerms = function showTerms (event) {

        event.stopPropagation();
        TermsDialog.show();
    };
}
