var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('TokensService', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(TokensService) {

        expect(TokensService).to.exist;
    }));

    it('should have public API', inject(function(TokensService) {

        expect(TokensService).to.respondTo('getTokens');
        expect(TokensService).to.respondTo('setTokens');
        expect(TokensService).to.respondTo('areTokensSet');
        expect(TokensService).to.respondTo('removeTokens');
        expect(TokensService).to.respondTo('getAccessToken');
        expect(TokensService).to.respondTo('getRefreshToken');
    }));

    describe('get tokens', function () {

        var userId = 'test2@test.com';
        var password = 'webmaster';

        it('should return the tokens given valid user credentials', inject(function(TokensService) {

            TokensService.getTokens(userId, password, function(tokens) {

                tokens.accessToken.should.not.be.undefined;
                tokens.refreshToken.should.not.be.undefined;
                tokens.accessToken.should.be.a('string');
                tokens.refreshToken.should.be.a('string');
            });
        }));

        it('should return the same tokens while the same user is logged in', inject(function(TokensService) {

            var initial;

            TokensService.getTokens(userId, password, function(tokens) {

                initial = tokens;
            });

            TokensService.getTokens(userId, password, function(tokens) {

                expect(tokens).to.eql(initial);
            });
        }));
    });

    describe('set tokens', function () {

        it('should store the tokens in memory', inject(function(TokensService) {

            var tokens = {};
            tokens.accessToken = 'ACCESS_TOKEN';
            tokens.refreshToken = 'REFRESH_TOKEN';

            TokensService.setTokens(tokens);

            TokensService.accessToken.should.equal(tokens.accessToken);
            TokensService.refreshToken.should.equal(tokens.refreshToken);
        }));

        it('should store the tokens in the session', inject(function(TokensService) {

            var tokens = {};
            tokens.accessToken = 'ACCESS_TOKEN';
            tokens.refreshToken = 'REFRESH_TOKEN';

            TokensService.setTokens(tokens);

            sessionStorage[tokens.accessToken].should.equal(tokens.accessToken);
            sessionStorage[tokens.refreshToken].should.equal(tokens.refreshToken);
            expect(localStorage[tokens.accessToken]).to.be.undefined;
            expect(localStorage[tokens.refreshToken]).to.be.undefined;
        }));

        it('should store the tokens in the persistent storage', inject(function(TokensService) {

            var tokens = {};
            tokens.accessToken = 'ACCESS_TOKEN';
            tokens.refreshToken = 'REFRESH_TOKEN';
            var persist = true;

            TokensService.setTokens(tokens, persist);

            localStorage[tokens.accessToken].should.equal(tokens.accessToken);
            localStorage[tokens.refreshToken].should.equal(tokens.refreshToken);
        }));

        it('should be retrievable', inject(function(TokensService) {

            var tokens = {};
            tokens.accessToken = 'ACCESS_TOKEN';
            tokens.refreshToken = 'REFRESH_TOKEN';

            TokensService.setTokens(tokens);

            TokensService.getAccessToken().should.equal(tokens.accessToken);
            TokensService.getRefreshToken().should.equal(tokens.refreshToken);
        }));

        it('should relfect set state', inject(function(TokensService) {

            var tokens = {};
            tokens.accessToken = 'ACCESS_TOKEN';
            tokens.refreshToken = 'REFRESH_TOKEN';

            TokensService.areTokensSet().should.be.false;
            TokensService.setTokens(tokens);
            TokensService.areTokensSet().should.be.true;
            TokensService.removeTokens();
            TokensService.areTokensSet().should.be.false;
        }));

        afterEach(function() {

            sessionStorage.clear();
            localStorage.clear();
        });
    });

    describe('remove tokens', function () {

        it('from all storage', inject(function(TokensService) {

            var tokens = {};
            tokens.accessToken = 'ACCESS_TOKEN';
            tokens.refreshToken = 'REFRESH_TOKEN';
            var persist = true;

            TokensService.setTokens(tokens, persist);

            TokensService.removeTokens();

            expect(TokensService.accessToken).to.be.undefined;
            expect(TokensService.refreshToken).to.be.undefined;
            expect(sessionStorage[tokens.accessToken]).to.be.undefined;
            expect(sessionStorage[tokens.refreshToken]).to.be.undefined;
            expect(localStorage[tokens.accessToken]).to.be.undefined;
            expect(localStorage[tokens.refreshToken]).to.be.undefined;
        }));
    });
});
