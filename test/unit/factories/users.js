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

    describe('getUserRoleForTeam', ()=> {


        let UsersFactory;
        let ROLES;
        let ROLE_TYPE;

        beforeEach(inject([
            'UsersFactory', 'ROLES', 'ROLE_TYPE',
            function(_UsersFactory_, _ROLES_, _ROLE_TYPE_) {

                UsersFactory = _UsersFactory_;
                ROLES = _ROLES_;
                ROLE_TYPE = _ROLE_TYPE_;

            }
        ]));

        it('should throw error if no role', function() {
            expect(function() {
                UsersFactory.getUserRoleForTeam()
            }).to.throw(Error);
        });

        it('should throw error if no team', function() {

            expect(function() {
                UsersFactory.getUserRoleForTeam({})
            }).to.throw(Error);
        });

        it('should return undefined if no roles are found', function() {

            let user = {
                roles: []
            }

            UsersFactory.extend(user);

            let userRoleForTeam = user.getUserRoleForTeam(1, {id: 1});

            expect(userRoleForTeam).to.be.undefined;
        });

        it(`should return undefined if a role is found that only matches ROLE and not the team`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoleForTeam = user.getUserRoleForTeam(ROLES.ASSISTANT_COACH, {id: 1});

            expect(userRoleForTeam).to.be.undefined;
        });

        it(`should return undefined if a role is found that only matches the team and not the ROLE`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoleForTeam = user.getUserRoleForTeam(ROLES.ASSISTANT_COACH, {id: 1});

            expect(userRoleForTeam).to.be.undefined;
        });

        it(`should return a role if a role is found that matches both the team and the ROLE`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 1
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoleForTeam = user.getUserRoleForTeam(ROLES.ASSISTANT_COACH, {id: 1});

            expect(userRoleForTeam).to.exist;
            expect(userRoleForTeam.type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
            expect(userRoleForTeam.teamId).to.equal(1);
        });

    });

    describe('getRoles', ()=> {

        let UsersFactory;
        let ROLES;
        let ROLE_TYPE;

        beforeEach(inject([
            'UsersFactory', 'ROLES', 'ROLE_TYPE',
            function(_UsersFactory_, _ROLES_, _ROLE_TYPE_) {

                UsersFactory = _UsersFactory_;
                ROLES = _ROLES_;
                ROLE_TYPE = _ROLE_TYPE_;

            }
        ]));

        it('should return an empty array if no roles are found', function() {

            let user = {};

            UsersFactory.extend(user);

            let userRoleForTeam = user.getRoles();

            expect(userRoleForTeam).to.be.an('array');
            expect(userRoleForTeam).to.be.empty;
        });

        it('should return only active roles by default', function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 3,
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoleForTeam = user.getRoles();

            expect(userRoleForTeam).to.be.an('array');
            expect(userRoleForTeam.length).to.equal(2);
        });

        it(`should return only inactive roles when 'active' is false`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 3,
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoleForTeam = user.getRoles(null, false);

            expect(userRoleForTeam).to.be.an('array');
            expect(userRoleForTeam.length).to.equal(1);
        });

        it(`should return all roles when 'active' is null`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 3,
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoleForTeam = user.getRoles(null, null);

            expect(userRoleForTeam).to.be.an('array');
            expect(userRoleForTeam.length).to.equal(3);
        });

        it(`should return roles of ROLE_TYPE that are active`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 3,
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoles = user.getRoles(ROLE_TYPE.COACH);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(1);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.COACH);
        });

        it(`should return roles of ROLE_TYPE that are inactive`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 3,
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, false);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(1);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
            expect(userRoles[0].tenureEnd).to.be.a('string');
        });

        it(`should return both active and inactive of roles of ROLE_TYPE`, function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 3,
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, null);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(2);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
            expect(userRoles[1].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

    });

});
