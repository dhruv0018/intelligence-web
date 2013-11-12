var IntelligenceWebClient = require('../app');

/**
 * A service to manage logging users in and out. It handles getting the OAuth
 * tokens, storing them, setting the HTTP authorization headers for future API
 * calls, retrieving the users data once authenticated and storing it for later.
 * @module IntelligenceWebClient
 * @name AuthenticationService
 * @type {service}
 */
IntelligenceWebClient.service('AuthenticationService', [
    '$rootScope', '$http', 'TokensService', 'SessionService',
    function($rootScope, $http, tokens, session) {

        return {

            /**
             * Logs a user in using their email address and password. If the
             * user opts to remember their login it is persisted until they
             * decide to logout.
             * @param {String} email - the users email address; used as a unique
             * identifier for the user.
             * @param {String} password - a password for the users email.
             * @param {Boolean} persist - a flag which indicates if the users
             * login should be persisted. If true, it will be persisted.
             * @callback {function(user)} callback - returns the current user.
             */
            loginUser: function(email, password, persist, callback) {

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
                tokens.getTokens(email, password, function(error, authTokens) {

                    if (error) return callback(error);

                    /* Store the tokens. Optionally persisting. */
                    tokens.setTokens(authTokens, persist);

                    /* Set the authorization header for future requests. */
                    $http.defaults.headers.common.Authorization = 'Bearer ' + tokens.getAccessToken();

                    /* Retrieve the user from the session. */
                    session.retrieveCurrentUser(email, function(error, user) {

                        if (error) return callback(error);

                        /* Store the user in the session. Optionally persisting. */
                        session.storeCurrentUser(user, persist);

                        callback(null, user);
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
            }
        };
    }
]);

