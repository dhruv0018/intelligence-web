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

    it('should exist', inject([
        'SessionService',
        function(session) {

            expect(session).to.exist;
        }
    ]));

    it('should not have a current user stored', inject([
        'SessionService',
        function(session) {

            session.clearCurrentUser();
            session.isCurrentUserStored().should.be.false;
            expect(session.currentUser).to.be.null;
            expect(localStorage['CURRENT_USER']).to.be.undefined;
            expect(sessionStorage['CURRENT_USER']).to.be.undefined;
        }
    ]));

    describe('storing users', function() {

        beforeEach(inject([
            'SessionService',
            function(session) {

                session.clearCurrentUser();
            }
        ]));

        it('should save a user in memory', inject([
            'SessionService',
            function(session) {

                session.storeCurrentUser(user);
                session.isCurrentUserStored().should.be.true;
                session.currentUser.should.not.be.null;
                session.currentUser.should.be.an('object');
                session.clearCurrentUser();
                session.isCurrentUserStored().should.be.false;
                expect(session.currentUser).to.be.null;
            }
        ]));

        it('should save a user in the session', inject([
            'SessionService',
            function(session) {

                session.storeCurrentUser(user);
                session.isCurrentUserStored().should.be.true;
                expect(sessionStorage['CURRENT_USER']).to.be.a('string');
                session.clearCurrentUser();
                session.isCurrentUserStored().should.be.false;
                expect(sessionStorage['CURRENT_USER']).to.be.undefined;
            }
        ]));

        it('should save a user persistently', inject([
            'SessionService',
            function(session) {

                var persist = true;
                session.storeCurrentUser(user, persist);
                session.isCurrentUserStored().should.be.true;
                expect(localStorage['CURRENT_USER']).to.be.a('string');
                session.clearCurrentUser();
                session.isCurrentUserStored().should.be.false;
                expect(sessionStorage['CURRENT_USER']).to.be.undefined;
            }
        ]));
    });

    describe('retrieving users', function() {

        it('should retrieve a user from memory', inject([
            'SessionService',
            function(session) {

                session.storeCurrentUser(user);
                session.isCurrentUserStored().should.be.true;
                session.retrieveCurrentUser().should.eql(user);
            }
        ]));

        it('should retrieve a user from the session', inject([
            'SessionService',
            function(session) {

                session.storeCurrentUser(user);
                session.isCurrentUserStored().should.be.true;
                expect(sessionStorage['CURRENT_USER']).to.be.a('string');
                session.currentUser = null;
                session.retrieveCurrentUser().should.eql(session.deserializeUser(JSON.stringify(user)));
            }
        ]));

        it('should retrieve a user from persistent storage', inject([
            'SessionService',
            function(session) {

                var persist = true;
                session.storeCurrentUser(user, persist);
                session.isCurrentUserStored().should.be.true;
                expect(localStorage['CURRENT_USER']).to.be.a('string');
                session.currentUser = null;
                sessionStorage.removeItem('CURRENT_USER');
                session.retrieveCurrentUser().should.eql(session.deserializeUser(JSON.stringify(user)));
            }
        ]));
    });
});
