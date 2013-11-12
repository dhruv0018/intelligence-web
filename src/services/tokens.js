var ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
var REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

var component = require('../../build/build.js');

var OAuth = component('oauth');

var IntelligenceWebClient = require('../app');

/**
 * A service to manage OAuth tokens. It handles retrieving them from the server
 * and storing them locally in memory and the session as well as persisting
 * them between sessions.
 * @module IntelligenceWebClient
 * @name TokenService
 * @type {service}
 */
IntelligenceWebClient.factory('TokensService', [
    'config', '$injector',
    function(config, $injector) {

        /**
         * Gets the tokens. Tokens are obtained by handshaking with the server
         * and providing user credentials to authorize. A users credentials
         * include an unique identifier and password. If the credentials are
         * authenticated the server returns an access and refresh OAuth token.
         * @param {String} userId - a unique identifier for a user.
         * @param {String} password - a password for the users identifier.
         * @callback {function(OAuth)} callback - returns the tokens as an OAuth
         * object; where tokens.accessToken and tokens.refreshToken are the
         * respective tokens.
         */
        var getTokens = function(userId, password, callback) {

            /* If the tokens are cached already, then there is no need to
             * request them, so just return them. */
            if (areTokensSet()) {

                var tokens = new OAuth(getAccessToken(), getRefreshToken());

                callback(null, tokens);
            }

            /* Request authentication from the server. */
            else {

                var oauth = $injector.instantiate(['config', OAuth]);

                oauth.getTokens(userId, password, function(error, tokens) {

                    $rootScope.$apply(function() {

                        callback(error, tokens);
                    });
                });
            }
        };

        /**
         * Sets the tokens. Will store the tokens in memory, the session,
         * and optionally persistently.
         * @param {OAuth} tokens - an OAuth object that contains the tokens.
         * @param {Boolean} persist - if true the tokens will be persisted.
         */
        var setTokens = function(tokens, persist) {

            this.accessToken = tokens.accessToken;
            this.refreshToken = tokens.refreshToken;

            sessionStorage[ACCESS_TOKEN_KEY] = tokens.accessToken;
            sessionStorage[REFRESH_TOKEN_KEY] = tokens.refreshToken;

            if (persist) {

                localStorage[ACCESS_TOKEN_KEY] = tokens.accessToken;
                localStorage[REFRESH_TOKEN_KEY] = tokens.refreshToken;
            }
        };

        /**
         * Removes the tokens from all storage.
         */
        var removeTokens = function() {

            /* Remove from memory. */
            delete this.accessToken;
            delete this.refreshToken;

            /* Remove from the session. */
            sessionStorage.removeItem(ACCESS_TOKEN_KEY);
            sessionStorage.removeItem(REFRESH_TOKEN_KEY);

            /* Remove from persistent storage. */
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        };

        /**
         * Returns the OAuth access token if stored or undefined if not.
         * @returns {String} the access token as a string.
         */
        var getAccessToken = function() {

            var accessToken = this.accessToken ||
                              sessionStorage[ACCESS_TOKEN_KEY] ||
                              localStorage[ACCESS_TOKEN_KEY] ||
                              undefined;

            return accessToken;
        };

        /**
         * Returns the OAuth refresh token if stored or undefined if not.
         * @returns {String} the refresh token as a string.
         */
        var getRefreshToken = function() {

            var refreshToken = this.refreshToken ||
                               sessionStorage[REFRESH_TOKEN_KEY] ||
                               localStorage[REFRESH_TOKEN_KEY] ||
                               undefined;

            return refreshToken;
        };

        /**
         * Checks if the tokens are currently stored in any way.
         * @returns {Boolean} true if the tokens are stored; false otherwise.
         */
        var areTokensSet = function() {

            return getAccessToken() !== undefined && getRefreshToken() !== undefined;
        };

        /* Public API. */
        return {

            getTokens: getTokens,
            setTokens: setTokens,
            areTokensSet: areTokensSet,
            removeTokens: removeTokens,
            getAccessToken: getAccessToken,
            getRefreshToken: getRefreshToken
        };
    }
]);

