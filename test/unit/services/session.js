var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('SessionService', function() {

    var url = 'https://www-dev.krossover.com/intelligence-api/v1/users/test@test.com';

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

        beforeEach(inject(function($httpBackend) {

            $httpBackend.when('GET', url).respond(user);
        }));

        it('given valid credentials should be a valid user', inject(function($httpBackend, SessionService) {

            var userId = 'test@test.com';

            $httpBackend.expectGET(url);

            SessionService.retrieveCurrentUser(userId, function(user) {

                user.should.not.be.undefined;
                user.should.be.an('object');
            });

            $httpBackend.flush();
        }));
    });

    describe('storing users', function() {

        var testUser;

        beforeEach(inject(function($httpBackend, SessionService) {

            var userId = 'test@test.com';

            $httpBackend.when('GET', url).respond(user);

            $httpBackend.expectGET(url);

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

        it('should save a user the session', inject(function(SessionService) {

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

