var request = require('superagent');

var HOST = process.env.HOST || 'www.dev.krossover.com';
var CLIENT_ID = process.env.CLIENT_ID || 'cid';
var CLIENT_SECRET = process.env.CLIENT_SECRET || 'csecret';

exports = module.exports = OAuth;


/**
 * OAuth class to handle the OAuth handshake.
 * @class
 */
function OAuth() {

    /** OAuth access token */
    this.accessToken = '';

    /** OAuth refresh token */
    this.refreshToken = '';
}


/**
 * Provides a shortcut for getting the access token. This performs the request
 * for an authorization code and then the following request for access token.
 * @param {string} username - username to use
 * @param {string} password - users password
 * @callback {function(error, token)} callback
 */
OAuth.prototype.getAccessToken = function(username, password, callback) {

    var self = this;

    self.requestAuthCode(username, password, function(error, code) {

        if (error) return callback(error);

        self.requestAccessToken(code, function(error, token) {

            callback(error, token);
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

    /* TODO: Change to use logging framework */
    console.log('Requesting authorization code');

    var url = 'https://';
    url += HOST;
    url += '/intelligence-api/oauth/authorize';
    url += '?response_type=' + 'code';
    url += '&client_id=' + CLIENT_ID;
    url += '&state=' + 'xyz';

    var data = {
        username: username,
        password: password,
        authorized: 'yes'
    };

    /* TODO: Change to use logging framework */
    console.log('Connecting to ' + url);

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

    if (!response.body) return callback(new Error('No authorization code response body received'));


    var code = response.body.code;

    /* TODO: Change to use logging framework */
    console.log('Received code: ' + code);

    callback(null, code);
};


/**
 * Requests an OAuth access token from the server.
 * @param {string} code - authorization code retrieved from requestAuthCode
 * @callback {function(error, accessToken)} callback
 */
OAuth.prototype.requestAccessToken = function(code, callback) {

    var self = this;

    /* TODO: Change to use logging framework */
    console.log('Requesting access token');

    var url = 'https://';
    url += HOST;
    url += '/intelligence-api/oauth/token';

    var data = {
        'grant_type': 'authorization_code',
        'code': code
    };

    /* TODO: Change to use logging framework */
    console.log('Connecting to ' + url);

    request
        .post(url)
        .type('form')
        .send(data)
        .auth(CLIENT_ID, CLIENT_SECRET)
        .end(function(error, response) {
            self.receiveAccessToken(error, response, callback);
        });
};


/**
 * Receives and parses the server response from the access token request.
 * @param {error} error - error to pass along
 * @param {string} response - the response from requestAccessToken to parse
 * @callback {function(error, accessToken)} callback
 */
OAuth.prototype.receiveAccessToken = function(error, response, callback) {
/* jshint camelcase:false */

    if (error) callback(error);

    /* TODO: Change to use logging framework */
    console.log('Received response: ' + response);

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
    console.log('Received access token: ' + accessToken);
    console.log('Received refresh token: ' + refreshToken);

    callback(null, accessToken);
};


/**
 * Requests a refresh of the OAuth access token.
 * @callback {function(error, accessToken)} callback
 */
OAuth.prototype.requestTokenRefresh = function(callback) {

    var self = this;

    /* TODO: Change to use logging framework */
    console.log('Refreshing access token');

    var url = 'https://';
    url += HOST;
    url += '/intelligence-api/oauth/token';

    var data = {
        'grant_type': 'refresh_token',
        'refresh_token': this.refreshToken
    };

    /* TODO: Change to use logging framework */
    console.log('Connecting to ' + url);

    request
        .post(url)
        .type('form')
        .send(data)
        .auth(CLIENT_ID, CLIENT_SECRET)
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

