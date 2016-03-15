//var component = require('../../build/build.js');

//var OAuth = component('oauth');

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage logging users in and out. It handles getting the OAuth
 * tokens, storing them, setting the HTTP authorization headers for future API
 * calls, retrieving the users data once authenticated and storing it for later.
 * @module IntelligenceWebClient
 * @name AuthenticationService
 * @type {service}
 */
IntelligenceWebClient.service('AuthenticationService', [
    'ANONYMOUS_USER', '$rootScope', '$injector', '$q', '$http', '$state', 'config', 'TokensService', 'SessionService', 'StorageManager', 'UsersFactory',
    function(ANONYMOUS_USER, $rootScope, $injector, $q, $http, $state, config, tokens, session, storage, users) {

        var AuthenticationService = {

            /**
             * Logs a user in using their email address and password. If the
             * user opts to remember their login it is persisted until they
             * decide to logout.
             * @param {String} email - the users email address; used as a unique
             * identifier for the user.
             * @param {String} password - a password for the users email.
             * @param {Boolean} persist - a flag which indicates if the users
             * login should be persisted. If true, it will be persisted.
             */
            loginUser: function(email, password, persist) {

                /* Make sure that both email and password are present. */
                if (!email) throw new Error('Missing email');
                if (!password) throw new Error('Missing password');

                /* Raise an error if session storage is not available. */
                if (!window.sessionStorage) {

                    throw new Error('Session storage not available');
                }

                /* Raise an error if trying to persist without a storage mechanism. */
                if (!window.localStorage && persist) {

                    throw new Error('Unable to persist login');
                }

                /* Get the OAuth authorization code by verifying the users email
                 * and password. */
                return tokens.requestAuthCode(email, password).then(function(code) {

                    /* Request OAuth tokens. */
                    return tokens.requestTokens(code).then(function(authTokens) {

                        /* Store the tokens. Optionally persisting. */
                        tokens.setTokens(authTokens, persist);

                        var user = $injector.get(users.model);

                        /* Get the user from the server. */
                        return user.get({ id: email }).$promise.then(function(user) {

                            user = session.deserializeUser(user);

                            /* Store the user in the session. Optionally persisting. */
                            session.storeCurrentUser(user, persist);

                            /* Retrieve the user from the session. */
                            var currentUser = session.retrieveCurrentUser();

                            /* Expose the current user on the root scope. */
                            $rootScope.currentUser = currentUser;

                            return currentUser;
                        });
                    });
                });
            },

            /**
             * Logs the current user out.
             */
            logoutUser: function() {

                tokens.removeTokens();
                session.clearCurrentUser();
                sessionStorage.clear();
                localStorage.clear();
            },

            /**
             * Checks if there is a user logged in.
             * @returns {Boolean} true if the user is logged in; false otherwise.
             */
            get isLoggedIn() {

                return tokens.areTokensSet() && session.isCurrentUserStored() && session.currentUser !== ANONYMOUS_USER;
            },

            /* Prevent overriding. */
            set isLoggedIn(noop) {

                throw new Error('Illegal attempt to override function isLoggedIn');
            },

            /**
             * Validates the password for a given email and password. If no
             * email is given, then the current users email address is used.
             * @param {String} email - an email address; used as a unique
             * identifier.
             * @param {String} password - a password for the given email.
             * @callback {function(error)} callback - returns an error if the
             * password is invalid, otherwise will return null, indicating a
             * valid password.
             */
            validatePassword: function(email, password, callback) {

                /* Attempt to retrieve the current users email if none given. */
                email = email || session.retrieveCurrentUser().email;

                /* Make sure that both email and password are present. */
                if (!email) throw new Error('Missing email');
                if (!password) throw new Error('Missing password');

                /* Request authentication from the server. */
                return tokens.requestAuthCode(email, password);
            }
        };

        return AuthenticationService;
    }
]);
