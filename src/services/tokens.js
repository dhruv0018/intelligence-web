/* Web storage keys. */
var TOKEN_TYPE = 'TOKEN_TYPE';
var ACCESS_TOKEN = 'ACCESS_TOKEN';
var REFRESH_TOKEN = 'REFRESH_TOKEN';
var ACCESS_TOKEN_EXPIRATION_TIME = 'ACCESS_TOKEN_EXPIRATION_TIME';
var ACCESS_TOKEN_EXPIRATION_DATE = 'ACCESS_TOKEN_EXPIRATION_DATE';
var REFRESH_TOKEN_EXPIRATION_TIME = 'REFRESH_TOKEN_EXPIRATION_TIME';
var REFRESH_TOKEN_EXPIRATION_DATE = 'REFRESH_TOKEN_EXPIRATION_DATE';

/* Defaults. */
var DEFAULT_ACCESS_TOKEN_TYPE = 'Bearer';
var DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 3600 * 1000;
var DEFAULT_REFRESH_TOKEN_EXPIRATION_TIME = 1209600 * 1000;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage OAuth tokens. It handles retrieving them from the server
 * and storing them locally in memory and the session as well as persisting
 * them between sessions.
 * @module IntelligenceWebClient
 * @name TokenService
 * @type {service}
 */
IntelligenceWebClient.factory('TokensService', [
    'config', '$injector', '$interval', '$timeout',
    function(config, $injector, $interval, $timeout) {

        var $http;
        var session;

        var TokenService = {

            /** OAuth authorization code */
            code: null,

            tokens: {

                /** The type of token */
                tokenType: DEFAULT_ACCESS_TOKEN_TYPE,

                /** OAuth access token */
                accessToken: null,

                /** OAuth refresh token */
                refreshToken: null,
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
                data += '&username=' + encodeURIComponent(username);
                data += '&password=' + encodeURIComponent(password);

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
             * Requests an OAuth tokens from the server.
             * @return {object} - the OAuth tokens
             */
            requestClientTokens: function() {

                var self = this;

                $http = $http || $injector.get('$http');

                var url = config.oauth.uri + 'token';

                var data = 'grant_type=client_credentials';

                var auth = config.oauth.client.id + ':' + config.oauth.client.secret;

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
                data += '&refresh_token=' + self.getRefreshToken();

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
             * Refreshes the OAuth access token.
             * @return {object} - the OAuth tokens
             */
            refreshToken: function() {

                var self = this;

                return self.requestTokenRefresh().then(

                    /* If the token was successfully refreshed. */
                    function(tokens) {

                        /* Store the tokens. Optionally persisting. */
                        self.setTokens(tokens);

                        return tokens;

                    /* If the token could not be refreshed. */
                    }, function() {

                        /* Remove the tokens. */
                        self.removeTokens();
                    }
                );
            },

            /**
             * Refreshes the OAuth access token at given intervals.
             * @param {Number} interval - the interval time in milliseconds.
             */
            refreshTokenInterval: function(interval) {

                /* Fallbacks for the refresh interval. */
                interval = interval || sessionStorage.getItem(ACCESS_TOKEN_EXPIRATION_TIME);
                interval = interval || localStorage.getItem(ACCESS_TOKEN_EXPIRATION_TIME);
                interval = interval || DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME;

                /* Cancel any previous refresh intervals. */
                $interval.cancel(this.refresh);

                /* If a refresh token is present. */
                if (this.getRefreshToken()) {

                    /* Automatically refresh the access token after it expires. */
                    this.refresh = $interval(this.refreshToken.bind(this), interval);
                }

                /* If the refresh token is not present. */
                else {

                    /* Remove the access token after expiration. */
                    this.refresh = $interval(this.removeTokens.bind(this), interval);
                }
            },

            /**
             * Sets the tokens. Will store the tokens in memory, the session,
             * and optionally persistently.
             * @param {OAuth} tokens - an OAuth object that contains the tokens.
             * @param {Boolean} persist - if true the tokens will be persisted.
             */
            setTokens: function(tokens, persist) {

                if (angular.isUndefined(persist)) {

                    session = session || $injector.get('SessionService');

                    var currentUser = session.retrieveCurrentUser();
                    persist = currentUser ? currentUser.persist : false;
                }

                if (!tokens.accessToken) throw new Error('No access token');

                if (tokens.tokenType) this.tokens.tokenType = tokens.tokenType;
                this.tokens.accessToken = tokens.accessToken;
                if (tokens.refreshToken) this.tokens.refreshToken = tokens.refreshToken;

                $http = $http || $injector.get('$http');

                /* Use the access token in the authorization header. */
                $http.defaults.headers.common.Authorization = this.tokens.tokenType + ' ' + this.tokens.accessToken;

                /* Calculate the access token expiration time. */
                var expiration = tokens.expiration ? Number(tokens.expiration) * 1000 : null;

                /* Start the access token refresh interval. */
                this.refreshTokenInterval(expiration);

                /* Calculate the token expiration dates. */
                var accessTokenExpirationDate = new Date(Date.now() + expiration);
                var refreshTokenExpirationDate = new Date(Date.now() + DEFAULT_REFRESH_TOKEN_EXPIRATION_TIME);

                /* Store the access token in the session. */
                sessionStorage.setItem(TOKEN_TYPE, this.tokens.tokenType);
                sessionStorage.setItem(ACCESS_TOKEN, this.tokens.accessToken);
                sessionStorage.setItem(ACCESS_TOKEN_EXPIRATION_TIME, expiration);
                sessionStorage.setItem(ACCESS_TOKEN_EXPIRATION_DATE, accessTokenExpirationDate);

                /* If a refresh token is present. */
                if (this.tokens.refreshToken) {

                    sessionStorage.setItem(REFRESH_TOKEN, this.tokens.refreshToken);
                    sessionStorage.setItem(REFRESH_TOKEN_EXPIRATION_TIME, DEFAULT_REFRESH_TOKEN_EXPIRATION_TIME);
                    sessionStorage.setItem(REFRESH_TOKEN_EXPIRATION_DATE, refreshTokenExpirationDate);
                }

                /* If the session should be persisted. */
                if (persist) {

                    localStorage.setItem(TOKEN_TYPE, this.tokens.tokenType);
                    localStorage.setItem(ACCESS_TOKEN, this.tokens.accessToken);
                    localStorage.setItem(ACCESS_TOKEN_EXPIRATION_TIME, expiration);
                    localStorage.setItem(ACCESS_TOKEN_EXPIRATION_DATE, accessTokenExpirationDate);
                }

                /* If the session should be persisted and a refresh token is present. */
                if (persist && this.tokens.refreshToken) {

                    localStorage.setItem(REFRESH_TOKEN, this.tokens.refreshToken);
                    localStorage.setItem(REFRESH_TOKEN_EXPIRATION_TIME, DEFAULT_REFRESH_TOKEN_EXPIRATION_TIME);
                    localStorage.setItem(REFRESH_TOKEN_EXPIRATION_DATE, refreshTokenExpirationDate);
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
                sessionStorage.removeItem(TOKEN_TYPE);
                sessionStorage.removeItem(ACCESS_TOKEN);
                sessionStorage.removeItem(REFRESH_TOKEN);
                sessionStorage.removeItem(ACCESS_TOKEN_EXPIRATION_DATE);
                sessionStorage.removeItem(REFRESH_TOKEN_EXPIRATION_DATE);

                /* Remove from persistent storage. */
                localStorage.removeItem(TOKEN_TYPE);
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                localStorage.removeItem(ACCESS_TOKEN_EXPIRATION_DATE);
                localStorage.removeItem(REFRESH_TOKEN_EXPIRATION_DATE);
            },

            /**
             * Returns the OAuth Authorization header if stored.
             * @returns {String} the Authorization header as a string.
             */
            getAuthorization: function() {
                return `${this.getTokenType()} ${this.getAccessToken()}`;
            },

            /**
             * Returns the OAuth token type if stored.
             * @returns {String} the token type as a string.
             */
            getTokenType: function() {

                var tokenType = this.tokens.tokenType ||
                                sessionStorage.getItem(TOKEN_TYPE) ||
                                localStorage.getItem(TOKEN_TYPE);

                return tokenType;
            },

            /**
             * Returns the OAuth access token if stored.
             * @returns {String} the access token as a string.
             */
            getAccessToken: function() {

                var accessToken =
                    this.tokens.accessToken ||
                    sessionStorage.getItem(ACCESS_TOKEN) ||
                    localStorage.getItem(ACCESS_TOKEN);

                return accessToken;
            },

            /**
             * Returns the OAuth refresh token if stored.
             * @returns {String} the refresh token as a string.
             */
            getRefreshToken: function() {

                var refreshToken =
                    this.tokens.refreshToken ||
                    sessionStorage.getItem(REFRESH_TOKEN) ||
                    localStorage.getItem(REFRESH_TOKEN);

                return refreshToken;
            },

            /**
             * Checks if the tokens are currently stored in any way.
             * @returns {Boolean} true if the tokens are stored; false otherwise.
             */
            areTokensSet: function() {

                return !!this.getAccessToken() && !!this.getRefreshToken();
            }
        };

        (function(tokens) {

            var now = new Date();

            /* Get the stored access token expiration date. */
            var accessTokenExpirationDate =
                sessionStorage.getItem(ACCESS_TOKEN_EXPIRATION_DATE) ||
                localStorage.getItem(ACCESS_TOKEN_EXPIRATION_DATE);

            /* If the access token expiration date is set. */
            if (accessTokenExpirationDate) {

                accessTokenExpirationDate = new Date(accessTokenExpirationDate);

                /* Check if the access token is out of date. */
                if (now > accessTokenExpirationDate) {

                    /* Refresh the access token. */
                    tokens.refreshToken();
                }

                /* If the access token has not expired yet. */
                else {

                    var $http = $injector.get('$http');

                    /* Set the access token in the authorization header. */
                    $http.defaults.headers.common.Authorization = tokens.getAuthorization();

                    /* Calculate the time remaining before the access token expires. */
                    var accessTokenTimeRemaining = accessTokenExpirationDate - now;

                    /* Set timeout to refresh the access token before it expires. */
                    $timeout(tokens.refreshToken.bind(tokens), accessTokenTimeRemaining);
                }
            }

            /* Get the stored refresh token expiration date. */
            var refreshTokenExpirationDate =
                sessionStorage.getItem(REFRESH_TOKEN_EXPIRATION_DATE) ||
                localStorage.getItem(REFRESH_TOKEN_EXPIRATION_DATE);

            /* If the refresh token expiration date is set. */
            if (refreshTokenExpirationDate) {

                refreshTokenExpirationDate = new Date(refreshTokenExpirationDate);

                /* Check if the refresh token is out of date. */
                if (now > refreshTokenExpirationDate) {

                    /* Remove the tokens. */
                    tokens.removeTokens();
                }
            }

        })(TokenService);

        return TokenService;
    }
]);
