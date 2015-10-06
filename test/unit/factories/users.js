var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('UsersFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(UsersFactory) {

        expect(UsersFactory).to.exist;
    }));

    it('should have public API', inject(function(UsersFactory) {

    }));

    describe('canPickupGames', function() {

        let UsersFactory;

        beforeEach(angular.mock.module($provide => {

            $provide.service('SessionService', function () {

                this.getCurrentRole = () => { return {indexerQuality: 1}; }
            });
        }));

        beforeEach(inject([
            'UsersFactory',
            function(_UsersFactory_) {

                UsersFactory = _UsersFactory_;

            }
        ]));

        it('should return if an indexer can pick up a game', ()=> {

                expect(UsersFactory.canPickupGames()).to.equal(true);
            });
    });

    describe('getRoleNameByRoleType', ()=> {
        it("Should return the correct name for each role type", inject([
            'ROLES', 'ROLE_ID', 'UsersFactory',
            function(ROLES, ROLE_ID, UsersFactory) {
                let typeIds = [0,1,2,3,4,5,6,7,9];
                typeIds.forEach(id => {
                    expect(UsersFactory.getRoleNameByRoleType(id)).to.equal(ROLES[ROLE_ID[id]].type.name);
                });
        }]));

        it("Should throw an error if the role type passed in doesn't exist", inject(['UsersFactory', function(UsersFactory) {
            let type = -1;
            expect(UsersFactory.getRoleNameByRoleType(type)).to.be.null;
        }]));
    });

    describe('getRolesByTeamId', ()=> {
        it("Should return empty array when there are no roles", inject(['UsersFactory',
            function(UsersFactory) {
                sinon.stub(UsersFactory,'hasNoRoles').returns(true);
                let roles = UsersFactory.getRolesByTeamId(1);
                assert(UsersFactory.hasNoRoles.should.have.been.called);
                expect(roles).to.be.an('array');
                expect(roles).to.be.empty;
        }]));

        it("Should return empty when there is no roles for the teamId", inject(['UsersFactory',
            function(UsersFactory) {
                sinon.stub(UsersFactory,'hasNoRoles').returns(false);
                UsersFactory.roles = [];
                let roles = UsersFactory.getRolesByTeamId(1);
                assert(UsersFactory.hasNoRoles.should.have.been.called);
                expect(roles).to.be.an('array');
                expect(roles).to.be.empty;
        }]));

        it("Should return roles when there is roles for the teamId", inject(['UsersFactory',
            function(UsersFactory) {
                sinon.stub(UsersFactory,'hasNoRoles').returns(false);
                UsersFactory.roles = [{
                    teamId:1,
                    dummy:'dummy1'
                },{
                    teamId:2,
                    dummy:'dummy2'
                }];
                let roles = UsersFactory.getRolesByTeamId(1);
                assert(UsersFactory.hasNoRoles.should.have.been.called);
                expect(roles).to.be.an('array');
                expect(roles).to.eql([{
                    teamId:1,
                    dummy:'dummy1'
                }]);
        }]));

    });

});
