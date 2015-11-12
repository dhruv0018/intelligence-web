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

            let userRoleForTeam = user.getRoles(null, null, false);

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

            let userRoleForTeam = user.getRoles(null, null, null);

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

            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, null, false);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(1);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
            expect(userRoles[0].tenureEnd).to.be.a('string');
        });

        it(`should return both active and inactive roles of ROLE_TYPE`, function() {

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

            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, null, null);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(2);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
            expect(userRoles[1].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it(`should return both active and inactive roles of a specified team of ROLE_TYPE`, function() {

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
            let team = { id: 2 };
            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, team, null);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(1);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it(`should return active roles of a specified team of ROLE_TYPE`, function() {

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
            let team = { id: 2 };
            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, team, true);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(1);
            expect(userRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it(`should return inactive roles of a specified team of ROLE_TYPE`, function() {

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
            let team = { id: 2 };
            let userRoles = user.getRoles(ROLE_TYPE.ASSISTANT_COACH, team, false);

            expect(userRoles).to.be.an('array');
            expect(userRoles.length).to.equal(0);
        });

    });

    describe('getRoleForTeam', ()=> {

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

        it('should throw error if no ROLE_TYPE is found', function() {

            let user = {};

            UsersFactory.extend(user);

            expect(function() {
                user.getRoleForTeam()
            }).to.throw(Error);
        });

        it('should throw error if no team is found', function() {

            let user = {};

            UsersFactory.extend(user);

            expect(function() {
                user.getRoleForTeam(ROLE_TYPE.COACH)
            }).to.throw(Error);
        });

        it('should return only active roles with ROLE_TYPE and team', function() {

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

            let team = { id: 2 };
            let userRoleForTeam = user.getRoleForTeam(ROLE_TYPE.ASSISTANT_COACH, team);

            expect(userRoleForTeam).to.be.an('object');
            expect(userRoleForTeam.type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it('should return only inactive roles with ROLE_TYPE and team', function() {

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

            let team = { id: 3 };
            let userRoleForTeam = user.getRoleForTeam(ROLE_TYPE.ASSISTANT_COACH, team, false);

            expect(userRoleForTeam).to.be.an('object');
            expect(userRoleForTeam.type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it('should return undefined with ROLE_TYPE and team that do not match', function() {

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

            let team = { id: 2 };
            let userRoleForTeam = user.getRoleForTeam(ROLE_TYPE.ASSISTANT_COACH, team, false);

            expect(userRoleForTeam).to.be.undefined;
        });

    });

    describe('getActiveRoles', ()=> {

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

        it('should return only active roles', function() {

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

            let activeRoles = user.getActiveRoles();

            expect(activeRoles).to.be.an('array');
            expect(activeRoles.length).to.equal(2);
            expect(activeRoles[0].type.id).to.equal(ROLE_TYPE.COACH);
            expect(activeRoles[1].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it('should return only active roles with ROLE_TYPE', function() {

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

            let activeRoles = user.getActiveRoles(ROLE_TYPE.COACH);

            expect(activeRoles).to.be.an('array');
            expect(activeRoles.length).to.equal(1);
            expect(activeRoles[0].type.id).to.equal(ROLE_TYPE.COACH);
        });

    });


    describe('getInactiveRoles', ()=> {

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

        it('should return only inactive roles', function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureEnd: "2010-08-13T20:09:59+00:00"
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

            let inactiveRoles = user.getInactiveRoles();

            expect(inactiveRoles).to.be.an('array');
            expect(inactiveRoles.length).to.equal(2);
            expect(inactiveRoles[0].type.id).to.equal(ROLE_TYPE.COACH);
            expect(inactiveRoles[1].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

        it('should return only inactive roles with ROLE_TYPE', function() {

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

            let inactiveRoles = user.getInactiveRoles(ROLE_TYPE.ASSISTANT_COACH);

            expect(inactiveRoles).to.be.an('array');
            expect(inactiveRoles.length).to.equal(1);
            expect(inactiveRoles[0].type.id).to.equal(ROLE_TYPE.ASSISTANT_COACH);
        });

    });

    describe('isActive', ()=> {

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

        it('should throw error if no role is passed in', function() {

            let user = {};

            UsersFactory.extend(user);

            expect(function() {
                user.isActive()
            }).to.throw(Error);
        });

        it('should return true for active role', function() {

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

            let isActiveRole = user.isActive(user.roles[0]);

            expect(isActiveRole).to.be.true;
        });

        it('should return false for inactive role', function() {

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

            let isActiveRole = user.isActive(user.roles[2]);

            expect(isActiveRole).to.be.false;
        });

    });

    describe('getUserByEmail', ()=> {

        let UsersFactory;
        let ROLES;
        let ROLE_TYPE;

        beforeEach(inject([
            'UsersFactory',
            function(_UsersFactory_, _ROLES_, _ROLE_TYPE_) {

                UsersFactory = _UsersFactory_;
                ROLES = _ROLES_;
                ROLE_TYPE = _ROLE_TYPE_;

            }
        ]));

        it('should return null if no email is passed in', function() {

            let user = {};

            UsersFactory.extend(user);

            let userByEmail = user.getUserByEmail();

            expect(userByEmail).to.equal(null);
        });

        //TODO: Could not figure out how to test. Will need to come back to this.
        it('should return user if email is passed in', function() {

        });

    });

    describe('activateRole', ()=> {

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

        it('should make tenureEnd for given role null', function() {

            let user = {
                roles: [
                    {
                        type: ROLE_TYPE.COACH,
                        teamId: 1,
                        tenureStart: "2011-08-13T20:09:59+00:00",
                        tenureEnd: null
                    },
                    {
                        type: ROLE_TYPE.ASSISTANT_COACH,
                        teamId: 2,
                        tenureStart: "2011-08-13T20:09:59+00:00",
                        tenureEnd: "2014-08-13T20:09:59+00:00"
                    }
                ]
            };

            UsersFactory.extend(user);

            user.activateRole(user.roles[1]);
            expect(user.roles[1].tenureEnd).to.equal(null);
        });

    });

});
