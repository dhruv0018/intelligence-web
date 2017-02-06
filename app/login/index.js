/* Fetch angular from the browser scope */
const angular = window.angular;
const moment  = require('moment');

/* Template paths */
const LoginSignupTemplateUrl = 'app/login/signup.html';
const LoginTemplateUrl = 'app/login/template.html';
const LoginLoginTemplateUrl = 'app/login/login.html';
const LoginMaintenanceTemplateUrl = 'app/login/maintenance.html';
const LoginLockedTemplateUrl = 'app/login/locked.html';
const LoginForgotTemplateUrl = 'app/login/forgot.html';
const LoginResetTemplateUrl = 'app/login/reset.html';
const LoginNewUserTemplateUrl = 'app/login/new-user.html';
const LoginNewUserErrorTemplateUrl = 'app/login/new-user-error.html';

/**
 * Login module for managing user logins.
 * @module Login
 */
const Login = angular.module('login', [
    'ui.router',
    'ui.bootstrap'
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
                        templateUrl: LoginSignupTemplateUrl
                    },
                    'main@login': {
                        templateUrl: LoginMaintenanceTemplateUrl,
                        controller: 'LoginController'
                    }
                }
            })

            .state('login', {
                url: '/login?{emailConfirmation:string}',
                views: {
                    'header@login': {
                        templateUrl: LoginSignupTemplateUrl
                    },
                    'root': {
                        templateUrl: LoginTemplateUrl,
                        controller: 'LoginController'
                    },
                    'main@login': {
                        templateUrl: LoginLoginTemplateUrl,
                        controller: 'LoginController'
                    }
                },

                onEnter: [
                    '$state', '$stateParams', 'ROLES', 'AuthenticationService', 'SessionService', 'AccountService', 'UsersFactory', 'AlertsService',
                    function ($state, $stateParams, ROLES, auth, session, account, users, alerts) {

                        if (auth.isLoggedIn && !$stateParams.emailConfirmation) {

                            let currentUser = session.retrieveCurrentUser();

                            account.gotoUsersHomeState(currentUser);
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
                        templateUrl: LoginLockedTemplateUrl,
                        controller: 'LoginController'
                    }
                }
            })

            .state('forgot', {
                url: '^/forgot-password',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: LoginSignupTemplateUrl
                    },
                    'main@login': {
                        templateUrl: LoginForgotTemplateUrl,
                        controller: 'LoginController'
                    }
                }
            })

            .state('reset', {
                url: '^/password-reset/:token',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: LoginSignupTemplateUrl
                    },
                    'main@login': {
                        templateUrl: LoginResetTemplateUrl,
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

            .state('new-user', {
                url: '^/new-user/:token?email&expires',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: LoginSignupTemplateUrl
                    },
                    'main@login': {
                        templateUrl: LoginNewUserTemplateUrl,
                        controller: 'LoginController'
                    }
                },
                data: {

                    isNewUser: true
                },
                onEnter: [
                    '$state',
                    '$stateParams',
                    'UsersFactory',
                    'EMAIL_REQUEST_TYPES',

                    function newUserOnEnter (
                        $state,
                        $stateParams,
                        users,
                        EMAIL_REQUEST_TYPES
                    ) {

                        let token   = $stateParams.token;
                        let email   = $stateParams.email;
                        let expires = moment.unix($stateParams.expires);
                        let now     = moment();

                        if (!token) {

                            onNewUserError('Missing token in new user activation URL!');
                        } else if (!email) {

                            onNewUserError('Missing email address in new user activation URL!');
                        } else if (!expires.isValid()) {

                            onNewUserError('Missing or invalid expires date in new user activation URL!');
                        } else if (expires.isBefore(now)) {

                            onNewUserError('New user activation token has expired');
                        }

                        /**
                         * Handles any errors arising from the new user URL
                         *
                         * @function onNewUserError
                         * @param {string} errorMsg - The message to be used in
                         * the throw.
                         */
                        function onNewUserError (errorMsg) {

                            /* If an email was present on the original new user url,
                             * request the server to send a new new user email. */
                            if (email) {

                                $state.go('new-user-resend-email', {email}, {location: false});
                            } else {

                                $state.go('new-user-error');
                            }

                            throw new Error(errorMsg);
                        }
                    }
                ]
            })

            .state('new-user-resend-email', {
                url: '/new-user-resend-email/:email',
                onEnter: [
                    '$state',
                    '$stateParams',
                    'UsersFactory',
                    'EMAIL_REQUEST_TYPES',

                    function newUserOnErrorEnter (
                        $state,
                        $stateParams,
                        users,
                        EMAIL_REQUEST_TYPES
                    ) {

                        let email = $stateParams.email;

                        /* Request server to resend the new user activation email */
                        users.resendEmail(EMAIL_REQUEST_TYPES.NEW_USER, null, email)
                        .then(function emailRequestSuccess () {

                            /* Request for new user activation email successful. */
                            $state.go('new-user-error', {email, resent: true});
                        }, function emailRequestError (error) {

                            /* User has already activated their account. */
                            if (error.status === 400) {

                                $state.go('new-user-error', {email, activated: true});

                            /* All other errors; show generic error message. */
                            } else {

                                $state.go('new-user-error', {email, resent: false});
                            }
                        });
                    }
                ]
            })

            .state('new-user-error', {
                url: '^/new-user-error/:email?activated&resent',
                parent: 'login',
                views: {
                    'header@login': {
                        templateUrl: LoginSignupTemplateUrl
                    },
                    'main@login': {
                        templateUrl: LoginNewUserErrorTemplateUrl,
                        controller: 'LoginController'
                    }
                },
                data: {

                    isNewUser: true
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
    'TermsPopup.Modal',
    'EMAIL_REQUEST_TYPES'
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
    TermsModal,
    EMAIL_REQUEST_TYPES
) {

    $scope.config = config;
    $scope.isMobile = ($rootScope.DEVICE.ANDROID || $rootScope.DEVICE.IOS) && $rootScope.viewport.name == 'Mobile';
    $scope.hideBanner = $state.current.name === 'maintenance';

    let currentUser = session.retrieveCurrentUser();

    if (currentUser && currentUser.persist) {

        $scope.login = {};
        $scope.login.email = currentUser.email;
        $scope.login.remember = currentUser.persist;
    }

    if($stateParams.emailConfirmation && !$scope.confirmingEmail){

        // The controller gets called twice so this prevents two calls being made to confirm the new email
        $scope.confirmingEmail = true;

        if(auth.isLoggedIn){
            auth.logoutUser();
        }

        users.emailConfirm($stateParams.emailConfirmation).then(

            function success(data, status) {
                alerts.add({
                    type: 'success',
                    message: 'Email successfully changed! You can now login with your new email address.'
                });
                localStorage.setItem('emailChanged', data.email);
                $scope.login = {};
                $scope.login.email = data.email;
            },

            function error(data, status) {
                alerts.add({
                    type: 'danger',
                    message: 'This request has expired. In order to change your email address, login and resend the verification email.'
                });

                throw new Error('Could not confirm email change');
            }
        );

    }

    if ($state.current.data && $state.current.data.isResettingPassword) {

        $scope.resetPassword = true;
    }

    if ($state.current.data && $state.current.data.isNewUser) {

        $scope.newUser = {
            password     : undefined,
            showPassword : false, // By default, hide the new user's password
            agree        : false,
            email        : $stateParams.email,
            activated    : $stateParams.activated === 'true' ? true : false,
            resent       : $stateParams.resent === 'true' ? true : false
        };
    }

    $scope.submitNewUserLogin = function submitNewUserLogin () {

        $scope.login.submitted = true;

        let email    = $scope.login.email;
        let password = $scope.login.password;

        /* Login the user. */
        auth.loginUser(email, password)
        .then((user) => {

            if (user) {

                /* Track the event for MixPanel */
                analytics.track('Login', {
                    category : 'Login',
                    action   : 'Selected',
                    label    : 'SignIn'
                });

                /* First login, so user has already accepted Terms and
                 * Conditions by setting password. Record that. */
                user.updateTermsAcceptedDate();

                /* Update last accessed data and save. */
                user.lastAccessed = new Date().toISOString();
                user.save();

                /* Once successfully logged in, determine the user's home state.
                 */
                account.gotoUsersHomeState(user);
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

                    alerts.add({
                        type: 'danger',
                        message: 'No account found for that email.'
                    });
                }

                /* Handle case where the API returns an error because the
                 * user is not authorized. */
                else if (error.name === 'NotAuthorizedError') {

                    alerts.add({
                        type: 'danger',
                        message: 'Not authorized.'
                    });
                }

                else throw error;
            }
        });
    };

    $scope.submitLogin = function submitLogin () {

        $scope.login.submitted = true;

        let email = $scope.login.email;
        let password = $scope.login.password;
        let persist = $scope.login.remember;

        /* Login the user. */
        auth.loginUser(email, password, persist).then(function(user) {
            if (user) {

                /* Track the event for MixPanel */
                analytics.track('Login', {
                    category : 'Login',
                    action   : 'Selected',
                    label    : 'SignIn'
                });

                /* Update last accessed data and save. */
                user.lastAccessed = new Date().toISOString();
                user.save();

                /* Once successfully logged in, determine the user's home state.
                */
                account.gotoUsersHomeState(user);
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
                        type: 'success',
                        message: 'An email has been sent to ' + email + ' with further instructions.'
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
                        message: 'Sorry, the link is no longer valid. Click <a href="/intelligence/forgot-password">here</a> to reset your password again.'
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
            let email    = $stateParams.email;
            let password = $scope.newUser.password;

            users.passwordReset(token, password).then(

                function success(data, status) {

                    $scope.login          = {};
                    $scope.login.email    = data.email;
                    $scope.login.password = password;

                    $scope.submitNewUserLogin();
                },

                function error(data, status) {

                    $state.go('new-user-resend-email', {email}, {location: false});
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
        TermsModal.open();
    };
}
