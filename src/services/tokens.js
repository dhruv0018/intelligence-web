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

        var $http;

        /** OAuth access token */
        this.accessToken = null;

        /** OAuth refresh token */
        this.refreshToken = null;

        /**
        * Requests an authorization code from the server.
        * @param {string} username - username to use
        * @param {string} password - users password
        */
        var requestAuthCode = function(username, password) {

            $http = $http || $injector.get('$http');

            var url = config.oauth.uri + 'authorize';
            url += '?response_type=' + 'code';
            url += '&client_id=' + config.oauth.clientId;
            url += '&state=' + config.oauth.state;

            var data = 'authorized=yes';
            data += '&username=' + username;
            data += '&password=' + password;

            var request = {

                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: url,
                data: data
            };

            return $http(request)
            .success(receiveAuthCode)
            .error(handleAuthError)
            .then(function() {

                return this.code;
            });
        };

        /**
        * Receives and parses the server response from the authorization request.
        * @param {string} response - the response from requestAuthCode to parse
        * @callback {function(error, code)} callback
        */
        var receiveAuthCode = function(response) {

            if (!response || !response.code) return new Error('No authorization code received');

            this.code = response.code;

            /* TODO: Change to use logging framework */
            console.log('OAuth Auth Code: ' + this.code);

            return this.code;
        };

        var handleAuthError = function(response, status, headers, config) {

            switch(status) {

                /* Unauthorized */
                case 401:

                    var NotAuthorizedError = new Error('Not authorized');
                    NotAuthorizedError.name = 'NotAuthorizedError';
                    return NotAuthorizedError;

                /* Forbidden */
                case 403:

                    var ForbiddenError = new Error('User is forbidden');
                    ForbiddenError.name = 'ForbiddenError';
                    return ForbiddenError;

                /* Not Found */
                case 404:

                    var NotFoundError = new Error('User not found');
                    NotFoundError.name = 'NotFoundError';
                    return NotFoundError;

                /* Default */
                default:

                    var AuthorizationError = new Error('Error authorizing');
                    AuthorizationError.name = 'AuthorizationError';
                    return AuthorizationError;
            }
        };

        /**
        * Requests an OAuth tokens from the server.
        * @param {string} code - authorization code retrieved from requestAuthCode
        */
        var requestTokens = function(code) {

            $http = $http || $injector.get('$http');

            var url = config.oauth.uri + 'token';

            var data = 'grant_type=authorization_code';
            data += '&code=' + code;

            var auth = config.oauth.clientId + ':' + config.oauth.clientSecret;

            var headers = {

                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(auth)
            };

            var request = {

                method: 'POST',
                headers: headers,
                url: url,
                data: data
            };

            return $http(request)
            .success(receiveTokens)
            .then(function() {

                return this.tokens;
            });
        };

        /**
        * Receives and parses the server response from the access token request.
        * @param {error} error - error to pass along
        * @param {string} response - the response from requestAccessToken to parse
        */
        var receiveTokens = function(response) {
        /* jshint camelcase:false */

            var accessToken = response.access_token;
            var refreshToken = response.refresh_token;

            this.tokens = {

                accessToken: accessToken,
                refreshToken: refreshToken
            };

            if (accessToken) {

                this.accessToken = accessToken;

            } else {
                throw new Error('No access token recieved!');
            }

            if (refreshToken)
                this.refreshToken = refreshToken;

            /* TODO: Change to use logging framework */
            console.log('OAuth Access Token: ' + accessToken);
            console.log('OAuth Refresh Token: ' + refreshToken);

            return this.tokens;
        };

        /**
         * Gets the tokens. Tokens are obtained by handshaking with the server
         * and providing user credentials to authorize. A users credentials
         * include an unique identifier and password. If the credentials are
         * authenticated the server returns an access and refresh OAuth token.
         * @param {String} username - a unique identifier for a user.
         * @param {String} password - a password for the users identifier.
         */
        var getTokens = function(username, password) {

            return requestAuthCode(username, password).then(function(code) {

                return requestTokens(code).then(function(tokens) {

                    return tokens;
                });
            });
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

