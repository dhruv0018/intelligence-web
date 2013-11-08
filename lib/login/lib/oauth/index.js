var request = require('superagent');

exports = module.exports = OAuth;


/**
 * OAuth class to handle the OAuth handshake.
 * @class
 */
function OAuth(config, accessToken, refreshToken) {

    this.config = config;

    /** OAuth access token */
    this.accessToken = accessToken || undefined;

    /** OAuth refresh token */
    this.refreshToken = refreshToken || undefined;
}


/**
 * Provides a shortcut for getting the access token. This performs the request
 * for an authorization code and then the following request for access token.
 * @param {string} username - username to use
 * @param {string} password - users password
 * @callback {function(error, token)} callback
 */
OAuth.prototype.getTokens = function(username, password, callback) {

    var self = this;

    self.requestAuthCode(username, password, function(error, code) {

        if (error) return callback(error);

        self.requestTokens(code, function(error, tokens) {

            callback(error, tokens);
        });
    });
};


/**
 * Requests an authorization code from the server.
 * @param {string} username - username to use
 * @param {string} password - users password
 * @callback {function(error, code)} callback
 */
OAuth.prototype.requestAuthCode = function(username, password, callback) {

    var self = this;

    var url = this.config.oauth.uri + 'authorize';
    url += '?response_type=' + 'code';
    url += '&client_id=' + this.config.oauth.clientId;
    url += '&state=' + this.config.oauth.state;

    var data = {
        username: username,
        password: password,
        authorized: 'yes'
    };

    request
        .post(url)
        .type('form')
        .send(data)
        .end(function(error, response) {

            self.receiveAuthCode(error, response, callback);
        });
};


/**
 * Receives and parses the server response from the authorization request.
 * @param {error} error - error to pass along
 * @param {string} response - the response from requestAuthCode to parse
 * @callback {function(error, code)} callback
 */
OAuth.prototype.receiveAuthCode = function(error, response, callback) {

    if (error) return callback(error);

    if (!response) return callback(new Error('No authorization code response received'));

    if (response.unauthorized) {

        /* TODO: Using a lightweight custom error;
         * when custom errors are defined, switch this to a full custom error. */
        var NotAuthorizedError = new Error('Not authorized');
        NotAuthorizedError.name = 'NotAuthorizedError';
        return callback(NotAuthorizedError);
    }

    if (!response.body) return callback(new Error('No authorization code response body received'));

    var code = response.body.code;

    /* TODO: Change to use logging framework */
    console.log('OAuth Auth Code: ' + code);

    callback(null, code);
};


/**
 * Requests an OAuth tokens from the server.
 * @param {string} code - authorization code retrieved from requestAuthCode
 * @callback {function(error, accessToken)} callback
 */
OAuth.prototype.requestTokens = function(code, callback) {

    var self = this;

    var url = this.config.oauth.uri + 'token';

    var data = {
        'grant_type': 'authorization_code',
        'code': code
    };

    request
        .post(url)
        .type('form')
        .send(data)
        .auth(this.config.oauth.clientId, this.config.oauth.clientSecret)
        .end(function(error, response) {
            self.receiveTokens(error, response, callback);
        });
};


/**
 * Receives and parses the server response from the access token request.
 * @param {error} error - error to pass along
 * @param {string} response - the response from requestAccessToken to parse
 * @callback {function(error, accessToken)} callback
 */
OAuth.prototype.receiveTokens = function(error, response, callback) {
/* jshint camelcase:false */

    if (error) callback(error);

    var accessToken = response.body.access_token;
    var refreshToken = response.body.refresh_token;

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

    callback(null, this);
};


/**
 * Requests a refresh of the OAuth access token.
 * @callback {function(error, accessToken)} callback
 */
OAuth.prototype.requestTokenRefresh = function(callback) {

    var self = this;

    var url = this.config.oauth.uri + 'token';

    var data = {
        'grant_type': 'refresh_token',
        'refresh_token': this.refreshToken
    };

    request
        .post(url)
        .type('form')
        .send(data)
        .auth(this.config.oauth.clientId, this.config.oauth.clientSecret)
        .end(function(error, response) {
            self.receiveAccessToken(error, response, callback);
        });
};


/**
 * Signs a request to `url` with an OAuth token. It uses the token retrieved in
 * `requestAccessToken`. It will throw an error if no token is stored already.
 * @param {string} url
 * @callback {function(error, response, callback)} callback
 */
OAuth.prototype.signRequest = function(url, callback) {

    var self = this;

    /* TODO: Change to use logging framework */
    console.log('Attempting to sign request');

    if (! this.accessToken) {
        callback(new Error('No access token!'));
    }

    /* TODO: Change to use logging framework */
    console.log('Signing request to ' + url);

    request
        .get(url)
        .set('Authorization', 'Bearer ' + this.accessToken)
        .end(function(error, response) {
            self.signedResponse(error, response, callback);
        });
};


/**
 * Parses and passes on the server response from a signed request.
 * @param {error} error - error to pass along
 * @param {string} response - the response from signRequest to parse
 * @callback {function(error, response)} callback
 */
OAuth.prototype.signedResponse = function(error, response, callback) {

    var self = this;

    if (error) callback(error);

    /* TODO: Change to use logging framework */
    console.log('Received response: ' + response);

    if (response.body.error === 'invalid_request') {

        /* TODO: Change to use logging framework */
        console.log('Current access token is invalid, attempting to refresh it');

        self.requestTokenRefresh(function(error) {

            if (error) callback(error);

            self.signRequest(url, callback);

        });
    }

    callback(null, response.body);
};

