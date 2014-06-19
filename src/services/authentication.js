//var component = require('../../build/build.js');

//var OAuth = component('oauth');

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * A service to manage logging users in and out. It handles getting the OAuth
 * tokens, storing them, setting the HTTP authorization headers for future API
 * calls, retrieving the users data once authenticated and storing it for later.
 * @module IntelligenceWebClient
 * @name AuthenticationService
 * @type {service}
 */
IntelligenceWebClient.service('AuthenticationService', [
    '$rootScope', '$injector', '$q', '$http', 'config', 'TokensService', 'SessionService', 'UsersFactory',
    function($rootScope, $injector, $q, $http, config, tokens, session, users) {

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

                /* Get the OAuth tokens by verifying the users email and password
                 * though the API. Optionally persisting the tokens and user. */
                return tokens.getTokens(email, password).then(function(authTokens) {

                    /* Store the tokens. Optionally persisting. */
                    tokens.setTokens(authTokens, persist);

                    /* Set the authorization header for future requests. */
                    $http.defaults.headers.common.Authorization = 'Bearer ' + tokens.getAccessToken();

                    /* Get the user from the server. */
                    console.log(email);
                    return users.getOne(email).then(function(user) {
                        console.log(user);
                        /* Store the user in the session. Optionally persisting. */
                        session.storeCurrentUser(user, persist);

                        return user;
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

                return tokens.areTokensSet() && session.isCurrentUserStored();
            },

            /* Prevent overriding. */
            set isLoggedIn(noop) {

                throw new Error('Illegal attempt to override function isLoggedIn');
            },

            requestPasswordReset: function(email, success, error) {
                var endpoint = config.passwordReset.uri + email;
                var request = {
                    method: 'GET',
                    url: endpoint
                };
                success = success || {};
                error = error || function(data, status) {
                    throw new Error('Password reset request error: Http Status : ' + status);
                };
                $http(request).success(success).error(error);
            },

            processPasswordReset: function(token, password, success, error) {
                var endpoint = config.passwordReset.uri + token;
                var request = {
                    method: 'POST',
                    data: 'password=' + password,
                    url: endpoint,
                    headers: {'Content-type': 'application/x-www-form-urlencoded'}
                };
                success = success || {};
                error = error || function(data, status) {
                    throw new Error('Password reset processing error: Http Status : ' + status);
                };
                $http(request).success(success).error(error);
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

                var oauth = $injector.instantiate(['config', OAuth]);

                /* Request authentication from the server. */
                oauth.requestAuthCode(email, password, function(error) {

                    $rootScope.$apply(function() {

                        callback(error);
                    });
                });
            }
        };

        return AuthenticationService;
    }
]);

