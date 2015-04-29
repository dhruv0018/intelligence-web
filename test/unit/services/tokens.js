var ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
var REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('TokensService', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(TokensService) {

        expect(TokensService).to.exist;
    }));

    it('should have public API', inject(function(TokensService) {

        expect(TokensService).to.respondTo('requestAuthCode');
        expect(TokensService).to.respondTo('receiveAuthCode');
        expect(TokensService).to.respondTo('handleAuthError');
        expect(TokensService).to.respondTo('requestTokens');
        expect(TokensService).to.respondTo('receiveTokens');
        expect(TokensService).to.respondTo('requestTokenRefresh');
        expect(TokensService).to.respondTo('setTokens');
        expect(TokensService).to.respondTo('getTokenType');
        expect(TokensService).to.respondTo('areTokensSet');
        expect(TokensService).to.respondTo('removeTokens');
        expect(TokensService).to.respondTo('getAccessToken');
        expect(TokensService).to.respondTo('getRefreshToken');
    }));

    describe('receive authorization code', function() {

        it('should throw an error if no authorization code is received', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var response = {};

                expect(function() {

                    tokens.receiveAuthCode(response);

                }).to.throw(Error, 'No authorization code received');
            }
        ]));

        it('should return the authorization code in the response', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var code = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';

                var response = {

                    data: {
                        code: code
                    }
                };

                var authCode = tokens.receiveAuthCode(response);

                authCode.should.exist;
                authCode.should.be.ok;
                authCode.should.be.a('string');
                authCode.should.equal(code);
            }
        ]));
    });

    describe('handle authorization error', function() {

        it('should throw a NotAuthorizedError error given a 401 status', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var response = {

                    status: 401
                };

                expect(function() {

                    tokens.handleAuthError(response);

                }).to.throw(Error, 'Not authorized');
            }
        ]));

        it('should throw a ForbiddenError error given a 403 status', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var response = {

                    status: 403
                };

                expect(function() {

                    tokens.handleAuthError(response);

                }).to.throw(Error, 'User is forbidden');
            }
        ]));

        it('should throw a NotFoundError error given a 404 status', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var response = {

                    status: 404
                };

                expect(function() {

                    tokens.handleAuthError(response, status);

                }).to.throw(Error, 'User not found');
            }
        ]));

        it('should throw a AuthorizationError error given a any status other error status', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var response = {};
                var statuses = [405, 500];

                statuses.forEach(function(status) {

                    response.status = status;

                    expect(function() {

                        tokens.handleAuthError(response);

                    }).to.throw(Error, 'Error authorizing');
                });
            }
        ]));

        it('should return the authorization code in the response', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var code = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';

                var response = {

                    data: {
                        code: code
                    }
                };

                var authCode = tokens.receiveAuthCode(response);

                authCode.should.exist;
                authCode.should.be.ok;
                authCode.should.be.a('string');
                authCode.should.equal(code);
            }
        ]));
    });

    describe('request authorization code', function() {

        it('should respond with the authorization code when given valid login credentials', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var actualCode;

                var username = 'test@test.com';
                var password = 'password';

                var url = config.oauth.uri + 'authorize';
                url += '?response_type=' + 'code';
                url += '&client_id=' + config.oauth.clientId;
                url += '&state=' + config.oauth.state;

                var headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept':'application/json, text/plain, */*'
                };

                var expectedRequest = 'authorized=yes';
                expectedRequest += '&username=' + encodeURIComponent(username);
                expectedRequest += '&password=' + encodeURIComponent(password);

                var expectedCode = {

                    code: 'ABCDEFGHIJKLMNOPQRSTUVXYZ'
                };

                $httpBackend.expectPOST(url, expectedRequest, headers).respond(expectedCode);

                tokens.requestAuthCode(username, password).then(function(code) {

                    actualCode = code;
                });

                $httpBackend.flush();
                $rootScope.$apply();

                actualCode.should.to.be.a('string');
                actualCode.should.equal(expectedCode.code);
            }
        ]));
    });

    describe('request tokens', function() {

        it('should respond with the tokens when given valid login credentials', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var actualTokens;

                var url = config.oauth.uri + 'token';

                var code = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';

                var data = 'grant_type=authorization_code';
                data += '&code=' + code;

                var auth = config.oauth.clientId + ':' + config.oauth.clientSecret;

                var headers = {

                    'Accept':'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(auth)
                };

                var responseTokens = {

                    token_type: 'Bearer',
                    access_token: '0123456789',
                    refresh_token: '0123456789',
                    expires_in: 3600,
                    scope: null
                };

                var expectedTokens = {

                    tokenType: 'Bearer',
                    accessToken: '0123456789',
                    refreshToken: '0123456789',
                    expiration: 3600
                };

                $httpBackend.expectPOST(url, data, headers).respond(responseTokens);

                tokens.requestTokens(code).then(function(tokens) {

                    actualTokens = tokens;
                });

                $httpBackend.flush();
                $rootScope.$apply();

                actualTokens.should.to.be.an('object');
                actualTokens.should.contain.keys(Object.keys(expectedTokens));
                actualTokens.should.eql(expectedTokens);
            }
        ]));
    });

    describe('request token refresh', function() {

        it('should respond with the tokens when refreshed', inject([
            'config', '$rootScope', '$httpBackend', 'TokensService',
            function(config, $rootScope, $httpBackend, tokens) {

                var actualTokens;

                var refreshToken = 'REFRESH_TOKEN';

                var url = config.oauth.uri + 'token';

                var data = 'grant_type=refresh_token';
                data += '&refresh_token=' + refreshToken;

                var auth = config.oauth.clientId + ':' + config.oauth.clientSecret;

                var headers = {

                    'Accept':'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(auth)
                };

                var responseTokens = {

                    token_type: 'Bearer',
                    access_token: '0123456789',
                    expires_in: 3600,
                    scope: null
                };

                var expectedTokens = {

                    tokenType: 'Bearer',
                    accessToken: '0123456789',
                    refreshToken: undefined,
                    expiration: 3600
                };

                var storedTokens = {

                    tokenType: 'Bearer',
                    accessToken: '0123456789',
                    refreshToken: refreshToken,
                    expiration: 3600
                };

                tokens.setTokens(storedTokens);

                $httpBackend.expectPOST(url, data, headers).respond(responseTokens);

                tokens.requestTokenRefresh().then(function(tokens) {

                    actualTokens = tokens;
                });

                $httpBackend.flush();
                $rootScope.$apply();

                actualTokens.should.to.be.an('object');
                actualTokens.should.contain.keys(Object.keys(expectedTokens));
                actualTokens.should.eql(expectedTokens);
            }
        ]));
    });

    describe('get tokens', function() {

        var userId = 'test2@test.com';
        var password = 'webmaster';

        beforeEach(inject(function($httpBackend, config) {

            var code = {

                code: "60089ca5f66c2a7bca280ad6023f3bcfa94091e8"
            };

            var tokens = {

                access_token: "9a3b602b404b28f85966bd47683eef973e79e103",
                expires_in: 3600,
                token_type: "Bearer",
                scope: null,
                refresh_token: "c0897c9b7bbc8e9dfa062a5524897ff199f35942"
            };

            $httpBackend.whenGET(config.oauth.uri + 'authorize').respond(code);
            $httpBackend.whenGET(config.oauth.uri + 'token').respond(tokens);
        }));

        it('should return the tokens given valid user credentials', inject(function($httpBackend, TokensService) {

        }));

        it('should return the same tokens while the same user is logged in', inject(function($httpBackend, TokensService) {

        }));

        afterEach(inject(function(TokensService) {

            TokensService.removeTokens();
        }));
    });

    describe('set tokens', function () {

        it('should throw an error if the access token is missing', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    refreshToken: 'REFRESH_TOKEN'
                };

                expect(function() {

                    tokens.setTokens(tokensFixture);

                }).to.throw(Error, 'No access token');
            }
        ]));

        it('should store the tokens in memory', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    accessToken: 'ACCESS_TOKEN',
                    refreshToken: 'REFRESH_TOKEN'
                };

                tokens.setTokens(tokensFixture);

                tokens.getAccessToken().should.equal(tokensFixture.accessToken);
                tokens.getRefreshToken().should.equal(tokensFixture.refreshToken);
            }
        ]));

        it('should store the tokens in the session', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    accessToken: 'ACCESS_TOKEN',
                    refreshToken: 'REFRESH_TOKEN'
                };

                tokens.setTokens(tokensFixture, false);

                sessionStorage.getItem(ACCESS_TOKEN_KEY).should.equal(tokensFixture.accessToken);
                sessionStorage.getItem(REFRESH_TOKEN_KEY).should.equal(tokensFixture.refreshToken);
                expect(localStorage.getItem(ACCESS_TOKEN_KEY)).to.be.null;
                expect(localStorage.getItem(REFRESH_TOKEN_KEY)).to.be.null;
            }
        ]));

        it('should store the tokens in the persistent storage', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    accessToken: 'ACCESS_TOKEN',
                    refreshToken: 'REFRESH_TOKEN'
                };

                var persist = true;

                tokens.setTokens(tokensFixture, persist);

                localStorage.getItem(ACCESS_TOKEN_KEY).should.equal(tokensFixture.accessToken);
                localStorage.getItem(REFRESH_TOKEN_KEY).should.equal(tokensFixture.refreshToken);
            }
        ]));

        it('should be retrievable', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    accessToken: 'ACCESS_TOKEN',
                    refreshToken: 'REFRESH_TOKEN'
                };

                tokens.setTokens(tokensFixture);

                tokens.getAccessToken().should.equal(tokensFixture.accessToken);
                tokens.getRefreshToken().should.equal(tokensFixture.refreshToken);
            }
        ]));

        it('should reflect set state', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    accessToken: 'ACCESS_TOKEN',
                    refreshToken: 'REFRESH_TOKEN'
                };

                tokens.removeTokens();
                tokens.areTokensSet().should.be.false;
                tokens.setTokens(tokensFixture);
                tokens.areTokensSet().should.be.true;
                tokens.removeTokens();
                tokens.areTokensSet().should.be.false;
            }
        ]));

        afterEach(inject([
            'TokensService',
            function(tokens) {

                tokens.removeTokens();
            }
        ]));
    });

    describe('remove tokens', function () {

        it('from all storage', inject([
            'TokensService',
            function(tokens) {

                var tokensFixture = {

                    accessToken: 'ACCESS_TOKEN',
                    refreshToken: 'REFRESH_TOKEN'
                };

                var persist = true;

                tokens.setTokens(tokensFixture, persist);

                tokens.removeTokens();

                expect(tokens.getAccessToken()).to.be.null;
                expect(tokens.getRefreshToken()).to.be.null;
                expect(sessionStorage.getItem(ACCESS_TOKEN_KEY)).to.be.null;
                expect(sessionStorage.getItem(REFRESH_TOKEN_KEY)).to.be.null;
                expect(localStorage.getItem(ACCESS_TOKEN_KEY)).to.be.null;
                expect(localStorage.getItem(REFRESH_TOKEN_KEY)).to.be.null;
            }
        ]));
    });
});
