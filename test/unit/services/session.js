var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('SessionService', function() {

    var user = {
        "id":"1",
        "firstName":"test",
        "lastName":"test",
        "roles":[
            {"id":"1","userId":"1","type":{"id":"1","name":"super admin"},"teamId":null,"tenureStart":null,"tenureEnd":null,"isDefault":true},
            {"id":"2","userId":"1","type":{"id":"2","name":"admin"},"teamId":null,"tenureStart":null,"tenureEnd":null,"isDefault":false}
        ],
        "email":"test@test.com",
        "phone1":null,
        "phone2":null,
        "isActive":true,
        "password":null,
        "lastAccessed":"0000-00-00 00:00:00"
    };

    beforeEach(module('intelligence-web-client'));

    it('should exist', inject(function(SessionService) {

        expect(SessionService).to.exist;
    }));

    it('should not have a current user stored', inject(function(SessionService) {

        expect(SessionService.currentUser).to.be.null;
    }));

    describe('retrieving users', function() {

        var userId = 'test@test.com';

        beforeEach(inject(function($httpBackend, config) {

            var url = config.api.uri + 'users/' + userId;

            $httpBackend.whenGET(url).respond(user);
        }));

        it('given valid credentials should be a valid user', inject(function($httpBackend, SessionService) {

            SessionService.clearCurrentUser();
            SessionService.retrieveCurrentUser(userId, function(error, user) {

                expect(user).to.not.be.undefined;
            });

            $httpBackend.flush();
        }));
    });

    describe('storing users', function() {

        var testUser;

        beforeEach(inject(function($httpBackend, config, SessionService) {

            var userId = 'test@test.com';

            var url = config.api.uri + 'users/' + userId;

            $httpBackend.whenGET(url).respond(user);

            SessionService.clearCurrentUser();
            SessionService.retrieveCurrentUser(userId, function(retrievedUser) {

                testUser = retrievedUser;
            });

            $httpBackend.flush();
        }));

        it('should save a user in memory', inject(function(SessionService) {

            SessionService.storeCurrentUser(user);
            SessionService.isCurrentUserStored().should.be.true;
            SessionService.currentUser.should.not.be.null;
            SessionService.currentUser.should.be.an('object');
            SessionService.clearCurrentUser();
            SessionService.isCurrentUserStored().should.be.false;
            expect(SessionService.currentUser).to.be.null;
        }));

        it('should save a user in the session', inject(function(SessionService) {

            SessionService.storeCurrentUser(user);
            SessionService.isCurrentUserStored().should.be.true;
            expect(sessionStorage['CURRENT_USER']).to.be.a('string');
            SessionService.clearCurrentUser();
            SessionService.isCurrentUserStored().should.be.false;
            expect(sessionStorage['CURRENT_USER']).to.be.undefined;
        }));

        it('should save a user persistently', inject(function(SessionService) {

            var persist = true;
            SessionService.storeCurrentUser(user, persist);
            SessionService.isCurrentUserStored().should.be.true;
            expect(localStorage['CURRENT_USER']).to.be.a('string');
            SessionService.clearCurrentUser();
            SessionService.isCurrentUserStored().should.be.false;
            expect(sessionStorage['CURRENT_USER']).to.be.undefined;
        }));
    });
});

