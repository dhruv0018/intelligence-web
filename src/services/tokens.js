var TOKEN_TYPE_KEY = 'TOKEN_TYPE';
var ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
var REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

var DEFAULT_TOKEN_TYPE = 'Bearer';
var DEFAULT_TOKEN_EXPIRATION = 3600 * 1000;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * A service to manage OAuth tokens. It handles retrieving them from the server
 * and storing them locally in memory and the session as well as persisting
 * them between sessions.
 * @module IntelligenceWebClient
 * @name TokenService
 * @type {service}
 */
IntelligenceWebClient.factory('TokensService', [
    'config', '$injector', '$interval', '$sessionStorage', '$localStorage',
    function(config, $injector, $interval, $sessionStorage, $localStorage) {

        var $http;
        var session;

        var TokenService = {

            /** OAuth authorization code */
            code: null,

            tokens: {

                /** The type of token */
                tokenType: DEFAULT_TOKEN_TYPE,

                /** OAuth access token */
                accessToken: null,

                /** OAuth refresh token */
                refreshToken: null,

                /** The time until the access token expires. */
                expiration: DEFAULT_TOKEN_EXPIRATION
            },

            refresh: undefined,

            /**
            * Requests an authorization code from the server.
            * @param {string} username - username to use
            * @param {string} password - users password
            */
            requestAuthCode: function(username, password) {

                var self = this;

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
                .then(self.receiveAuthCode.bind(self), self.handleAuthError);
            },

            /**
            * Receives and parses the server response from the authorization request.
            * @param {string} response - the response from requestAuthCode to parse
            * @return {string} - the code received
            */
            receiveAuthCode: function(response) {

                if (!response || !response.data || !response.data.code) throw new Error('No authorization code received');

                this.code = response.data.code;

                /* TODO: Change to use logging framework */
                console.log('OAuth Auth Code: ' + this.code);

                return this.code;
            },

            handleAuthError: function(response) {

                switch (response.status) {

                    /* Unauthorized */
                    case 401:

                        var NotAuthorizedError = new Error('Not authorized');
                        NotAuthorizedError.name = 'NotAuthorizedError';
                        throw NotAuthorizedError;

                    /* Forbidden */
                    case 403:

                        var ForbiddenError = new Error('User is forbidden');
                        ForbiddenError.name = 'ForbiddenError';
                        throw ForbiddenError;

                    /* Not Found */
                    case 404:

                        var NotFoundError = new Error('User not found');
                        NotFoundError.name = 'NotFoundError';
                        throw NotFoundError;

                    /* Default */
                    default:

                        var AuthorizationError = new Error('Error authorizing');
                        AuthorizationError.name = 'AuthorizationError';
                        throw AuthorizationError;
                }
            },

            /**
            * Requests an OAuth tokens from the server.
            * @param {string} code - authorization code retrieved from requestAuthCode
            * @return {object} - the OAuth tokens
            */
            requestTokens: function(code) {

                var self = this;

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

                return $http(request).then(self.receiveTokens);
            },

            /**
            * Receives and parses the server response from the access token request.
            * @param {string} response - the response from requestAccessToken to parse
            */
            receiveTokens: function(response) {
                /*jshint sub:true*/

                var tokens = {

                    tokenType: response.data['token_type'],
                    accessToken: response.data['access_token'],
                    refreshToken: response.data['refresh_token'],
                    expiration: response.data['expires_in']
                };

                /* TODO: Change to use logging framework */
                console.log('OAuth Access Token: ' + tokens.accessToken);
                console.log('OAuth Refresh Token: ' + tokens.refreshToken);

                return tokens;
            },

            /**
            * Requests a refresh of the OAuth access token.
            * @return {object} - the OAuth tokens
            */
            requestTokenRefresh: function() {

                var self = this;

                $http = $http || $injector.get('$http');

                var url = config.oauth.uri + 'token';

                var data = 'grant_type=refresh_token';
                data += '&refresh_token=' + self.tokens.refreshToken;

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

                return $http(request).then(self.receiveTokens);
            },

            /**
            * Gets the tokens. Tokens are obtained by handshaking with the server
            * and providing user credentials to authorize. A users credentials
            * include an unique identifier and password. If the credentials are
            * authenticated the server returns an access and refresh OAuth token.
            * @param {String} username - a unique identifier for a user.
            * @param {String} password - a password for the users identifier.
            * @return {object} - the OAuth tokens
            */
            getTokens: function(username, password) {

                var self = this;

                return self.requestAuthCode(username, password).then(function(code) {

                    return self.requestTokens(code).then(function(tokens) {

                        return tokens;
                    });
                });
            },

            /**
            * Refreshes the OAuth access token.
            * @return {object} - the OAuth tokens
            */
            refreshToken: function() {

                var self = this;

                session = session || $injector.get('SessionService');

                var currentUser = session.retrieveCurrentUser();
                var persist = currentUser ? currentUser.persist : false;

                return self.requestTokenRefresh().then(function(tokens) {

                    /* Store the tokens. Optionally persisting. */
                    self.setTokens(tokens, persist);

                    return tokens;
                });
            },

            /**
            * Sets the tokens. Will store the tokens in memory, the session,
            * and optionally persistently.
            * @param {OAuth} tokens - an OAuth object that contains the tokens.
            * @param {Boolean} persist - if true the tokens will be persisted.
            */
            setTokens: function(tokens, persist) {

                if (!tokens.accessToken) throw new Error('No access token');

                if (tokens.tokenType) this.tokens.tokenType = tokens.tokenType;
                this.tokens.accessToken = tokens.accessToken;
                if (tokens.refreshToken) this.tokens.refreshToken = tokens.refreshToken;
                if (tokens.expiration) this.tokens.expiration = Number(tokens.expiration) * 1000;

                /* Cancel any previous refresh intervals. */
                $interval.cancel(this.refresh);

                /* If a refresh token is present. */
                if (this.tokens.refreshToken) {

                    /* Automatically refresh the access token after it expires. */
                    this.refresh = $interval(this.refreshToken.bind(this), this.tokens.expiration);
                }

                /* If the refresh token is not present. */
                else {

                    /* Remove the access token after expiration. */
                    this.refresh = $interval(this.removeTokens.bind(this), this.tokens.expiration);
                }

                $sessionStorage[TOKEN_TYPE_KEY] = tokens.tokenType;
                $sessionStorage[ACCESS_TOKEN_KEY] = tokens.accessToken;
                $sessionStorage[REFRESH_TOKEN_KEY] = tokens.refreshToken;

                if (persist) {

                    $localStorage[TOKEN_TYPE_KEY] = tokens.tokenType;
                    $localStorage[ACCESS_TOKEN_KEY] = tokens.accessToken;
                    $localStorage[REFRESH_TOKEN_KEY] = tokens.refreshToken;
                }
            },

            /**
            * Removes the tokens from all storage.
            */
            removeTokens: function() {

                $interval.cancel(this.refresh);

                /* Remove from memory. */
                delete this.tokens.accessToken;
                delete this.tokens.refreshToken;

                /* Remove from the session. */
                delete $sessionStorage[TOKEN_TYPE_KEY];
                delete $sessionStorage[ACCESS_TOKEN_KEY];
                delete $sessionStorage[REFRESH_TOKEN_KEY];

                /* Remove from persistent storage. */
                delete $localStorage[TOKEN_TYPE_KEY];
                delete $localStorage[ACCESS_TOKEN_KEY];
                delete $localStorage[REFRESH_TOKEN_KEY];
            },

            /**
            * Returns the OAuth token type if stored or undefined if not.
            * @returns {String} the token type as a string.
            */
            getTokenType: function() {

                var tokenType = this.tokens.tokenType ||
                                $sessionStorage[TOKEN_TYPE_KEY] ||
                                $localStorage[TOKEN_TYPE_KEY] ||
                                undefined;

                return tokenType;
            },

            /**
            * Returns the OAuth access token if stored or undefined if not.
            * @returns {String} the access token as a string.
            */
            getAccessToken: function() {

                var accessToken = this.tokens.accessToken ||
                                  $sessionStorage[ACCESS_TOKEN_KEY] ||
                                  $localStorage[ACCESS_TOKEN_KEY] ||
                                  undefined;

                return accessToken;
            },

            /**
            * Returns the OAuth refresh token if stored or undefined if not.
            * @returns {String} the refresh token as a string.
            */
            getRefreshToken: function() {

                var refreshToken = this.tokens.refreshToken ||
                                   $sessionStorage[REFRESH_TOKEN_KEY] ||
                                   $localStorage[REFRESH_TOKEN_KEY] ||
                                   undefined;

                return refreshToken;
            },

            /**
            * Checks if the tokens are currently stored in any way.
            * @returns {Boolean} true if the tokens are stored; false otherwise.
            */
            areTokensSet: function() {

                return this.getAccessToken() !== undefined && this.getRefreshToken() !== undefined;
            }
        };

        return TokenService;
    }
]);

