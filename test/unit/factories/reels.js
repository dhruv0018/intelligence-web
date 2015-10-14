chai.config.truncateThreshold = 0;
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var moment = require('moment');

describe('ReelsFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(ReelsFactory) {

        expect(ReelsFactory).to.exist;
    }));

    describe('shareWithTeam', ()=> {
        it("Should throw error when there is no team", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                expect(()=>ReelsFactory.shareWithTeam()).to.throw(Error);
        }]));

        it("Should not reshare when its already shared", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                let initialShares = [{sharedWithTeamId:1}];
                let reel = ReelsFactory.extend({id:2, shares:initialShares});
                let initialTeamShares = reel.sharedWithTeams;
                sinon.stub(reel,'isSharedWithTeam').returns(true);
                reel.shareWithTeam({id:1})
                expect(reel.shares).to.eql(initialShares);
                expect(reel.sharedWithTeams).to.eql(initialTeamShares);
        }]));

        it("Should share with team, without telestration", inject(['ReelsFactory', 'SessionService',
                                                                function(ReelsFactory, session) {
                session.currentUser = {id: 1};
                let initialShares = [{sharedWithTeamId:2}];
                let reel = ReelsFactory.extend({id:3, shares:initialShares});
                let initialTeamShares = reel.sharedWithTeams;
                let team = {id:4}
                const newShare = {
                        userId: session.currentUser.id,
                        reelId: reel.id,
                        sharedWithTeamId: team.id,
                        createdAt: moment.utc().toDate(),
                        isTelestrationsShared: false
                    };
                sinon.stub(reel,'isSharedWithTeam').returns(false);
                reel.shareWithTeam(team);
                assert(reel.isSharedWithTeam.should.have.been.called);
                let expectedShares = initialShares;
                expectedShares.push(newShare);
                let expectedTeamShares = initialTeamShares;
                expectedTeamShares[newShare.sharedWithTeamId] = newShare;
                expect(reel.shares).to.eql(expectedShares);
                expect(reel.sharedWithTeams).to.eql(expectedTeamShares);
        }]));

        it("Should share with team, with telestration", inject(['ReelsFactory', 'SessionService',
                                                                                        function(ReelsFactory, session) {
                session.currentUser = {id: 1};
                let initialShares = [{sharedWithTeamId:2}];
                let reel = ReelsFactory.extend({id:3, shares:initialShares});
                let initialTeamShares = reel.sharedWithTeams;
                let team = {id:4}
                const newShare = {
                        userId: session.currentUser.id,
                        reelId: reel.id,
                        sharedWithTeamId: team.id,
                        createdAt: moment.utc().toDate(),
                        isTelestrationsShared: true
                    };
                sinon.stub(reel,'isSharedWithTeam').returns(false);
                reel.shareWithTeam(team, true);
                assert(reel.isSharedWithTeam.should.have.been.called);
                let expectedShares = initialShares;
                expectedShares.push(newShare);
                let expectedTeamShares = initialTeamShares;
                expectedTeamShares[newShare.sharedWithTeamId] = newShare;
                expect(reel.shares).to.eql(expectedShares);
                expect(reel.sharedWithTeams).to.eql(expectedTeamShares);
        }]));
    });

    describe('stopSharing', ()=> {
        it("Should throw error when there is no share is requested", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                expect(()=>ReelsFactory.stopSharing()).to.throw(Error);
        }]));

        it("Should exit without failing when there are no sharing on the reel", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:3, shares:[]});
                let initialUserShares = reel.sharedWithUsers;
                let initialTeamShares = reel.sharedWithTeams;
                reel.stopSharing({id:1});
                expect(reel.shares).to.eql([]);
                expect(reel.sharedWithUsers).to.eql(initialUserShares);
                expect(reel.sharedWithTeams).to.eql(initialTeamShares);
        }]));
        it("Should exit without failing when the sharing is not found", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:3, shares:[{sharedWithUserId:1},{sharedWithTeamId:1}]});
                let initialUserShares = reel.sharedWithUsers;
                let initialTeamShares = reel.sharedWithTeams;
                reel.stopSharing({id:1});
                expect(reel.shares).to.eql([{sharedWithUserId:1},{sharedWithTeamId:1}]);
                expect(reel.sharedWithUsers).to.eql(initialUserShares);
                expect(reel.sharedWithTeams).to.eql(initialTeamShares);
        }]));
        it("Should remove the share when the user sharing is found", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:3, shares:[{sharedWithUserId:1},{sharedWithTeamId:1}]});
                let initialUserShares = reel.sharedWithUsers;
                let initialTeamShares = reel.sharedWithTeams;
                reel.stopSharing({sharedWithUserId:1});
                expect(reel.shares).to.eql([{sharedWithTeamId:1}]);
                expect(reel.sharedWithUsers).to.eql({});
                expect(reel.sharedWithTeams).to.eql(initialTeamShares);
        }]));
        it("Should remove the share when the team sharing is found", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:3, shares:[{sharedWithUserId:1},{sharedWithTeamId:1}]});
                let initialUserShares = reel.sharedWithUsers;
                let initialTeamShares = reel.sharedWithTeams;
                reel.stopSharing({sharedWithTeamId:1});
                expect(reel.shares).to.eql([{sharedWithUserId:1}]);
                expect(reel.sharedWithUsers).to.eql(initialUserShares);
                expect(reel.sharedWithTeams).to.eql({});
        }]));
    });

    describe('getShareByTeam', ()=> {
        it("Should throw error when there is no team to find", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                expect(()=>ReelsFactory.getShareByTeam()).to.throw(Error);
        }]));

        it("Should return share by team", inject(['ReelsFactory',
                                                                function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:4}]});
                sinon.stub(reel,'getShareByTeamId').returns({sharedWithTeamId:4});
                expect(reel.getShareByTeam({id:1})).to.eql({sharedWithTeamId:4});
                assert(reel.getShareByTeamId.should.have.been.called);
        }]));
    });

    describe('getShareByTeamId', ()=> {
        it("Should throw error when team sharing are not defined on the reel", inject(['ReelsFactory',
                                                                function(reel) {
                let teamId = 6;
                expect(()=>reel.getShareByTeamId(teamId)).to.throw(Error);
        }]));

        it("Should return the share when found", inject(['ReelsFactory', function(ReelsFactory) {
                let teamId = 6;
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:teamId}]});
                expect(reel.getShareByTeamId(teamId)).to.eql({sharedWithTeamId:teamId});
        }]));

        it("Should return undefined when not found", inject(['ReelsFactory', function(ReelsFactory) {
            let teamId = 6;
            let reel = ReelsFactory.extend({id:2, shares:[]});
            expect(reel.getShareByTeamId(teamId)).to.be.undefined;
        }]));
    });

    describe('isSharedWithTeam', ()=> {
        it("Should return false when there is no team", inject(['ReelsFactory',
                                                                function(reel) {
                expect(reel.isSharedWithTeam()).to.be.false;
        }]));

        it("Should return false when there is no team shares", inject(['ReelsFactory', function(reel) {
                let team = {id:6};
                expect(reel.isSharedWithTeam(team)).to.be.false;
        }]));

        it("Should return false when it is not shared with the team", inject(['ReelsFactory', function(ReelsFactory) {
            let team = {id:6};
            let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
            expect(reel.isSharedWithTeam(team)).to.be.false;
        }]));

        it("Should return true when it is shared with the team", inject(['ReelsFactory', function(ReelsFactory) {
            let team = {id:6};
            let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:team.id}]});
            expect(reel.isSharedWithTeam(team)).to.be.true;
        }]));
    });

    describe('isSharedWithCurrentUser', ()=> {
        it("Should return false, when user is not a coach and the it is not shared with the user", inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE',
                                                                function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                let user = UsersFactory.extend({id:2, roles:[{type:ROLE_TYPE.ATHLETE}]});
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(reel,'isSharedWithUser').withArgs(user).returns(false);
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithTeamId').withArgs(teamId).returns(false);
                expect(reel.isSharedWithCurrentUser()).to.be.false;
                assert(session.getCurrentUser.should.have.been.called);
                assert(reel.isSharedWithUser.should.have.been.called);
                assert(session.getCurrentTeamId.should.have.not.been.called);
                assert(reel.isSharedWithTeamId.should.have.not.been.called);
        }]));

        it("Should return true, when user is not a coach and the it is shared with the user", inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE',
                                                                                                    function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                let user = UsersFactory.extend({id:2, roles:[{type:ROLE_TYPE.ATHLETE}]});
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithUserId:2}]});
                let teamId = 7;
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(reel,'isSharedWithUser').withArgs(user).returns(true);
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithTeamId').withArgs(teamId).returns(false);
                expect(reel.isSharedWithCurrentUser()).to.be.true;
                assert(session.getCurrentUser.should.have.been.called);
                assert(reel.isSharedWithUser.should.have.been.called);
                assert(session.getCurrentTeamId.should.have.not.been.called);
                assert(reel.isSharedWithTeamId.should.have.not.been.called);
        }]));

        it("Should return false, when user is a coach and the it is not shared with the user and team", inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                                                            function(ReelsFactory, UsersFactory, session, ROLES) {
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(reel,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithTeamId').withArgs(teamId).returns(false);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:2, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(false);
                    expect(reel.isSharedWithCurrentUser()).to.be.false;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.been.called);
                    assert(reel.isSharedWithTeamId.should.have.been.called);
                });
        }]));

        it("Should return true, when user is a coach and the it is shared with the user", inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                                                    function(ReelsFactory, UsersFactory, session, ROLES) {
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(reel,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithTeamId').withArgs(teamId).returns(false);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:2, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(true);
                    expect(reel.isSharedWithCurrentUser()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.not.been.called);
                    assert(reel.isSharedWithTeamId.should.have.not.been.called);
                });
        }]));

        it("Should return true, when user is a coach and the it is not shared with the user, but shared with team", inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                                                    function(ReelsFactory, UsersFactory, session, ROLES) {
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(reel,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithTeamId').withArgs(teamId).returns(true);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:2, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(false);
                    expect(reel.isSharedWithCurrentUser()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.been.called);
                    assert(reel.isSharedWithTeamId.should.have.been.called);
                });
        }]));
    });

    describe('isSharedWithTeamId', ()=> {
        it("Should return false, when there is no teamId", inject(['ReelsFactory', function(ReelsFactory) {
                expect(ReelsFactory.isSharedWithTeamId()).to.be.false;
        }]));

        it("Should return false, when it is not shared with any team", inject(['ReelsFactory', function(ReelsFactory) {
                let teamId = 6;
                expect(ReelsFactory.isSharedWithTeamId(teamId)).to.be.false;
        }]));

        it("Should return false, when it is not shared with teamId", inject(['ReelsFactory', function(ReelsFactory) {
                let teamId = 6;
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                sinon.stub(reel,'getShareByTeamId').withArgs(teamId).returns(undefined);
                expect(reel.isSharedWithTeamId(teamId)).to.be.false;
                assert(reel.getShareByTeamId.should.have.been.called);
        }]));

        it("Should return true, when it is shared with teamId", inject(['ReelsFactory', function(ReelsFactory) {
                let teamId = 6;
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:6}]});
                sinon.stub(reel,'getShareByTeamId').withArgs(teamId).returns({sharedWithTeamId:6});
                expect(reel.isSharedWithTeamId(teamId)).to.be.true;
                assert(reel.getShareByTeamId.should.have.been.called);
        }]));
    });

    describe('getTeamShares', ()=> {
        it("Should throw error when team shares are not available on the reel", inject(['ReelsFactory', function(ReelsFactory) {
                expect(()=>ReelsFactory.getTeamShares()).to.throw(Error);
        }]));

        it("Should get the team shares", inject(['ReelsFactory', function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                expect(reel.getTeamShares()).to.eql([{sharedWithTeamId:7}]);
        }]));
    });

    describe('getNonPublicShares', ()=> {
        it("Should return only non public shares", inject(['ReelsFactory', function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(reel.getNonPublicShares()).to.eql([{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}]);
        }]));
    });

    describe('isPublicShare', ()=> {
        it("Should return false when if the share is not non public", inject(['ReelsFactory', function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(reel.isPublicShare({id:1, sharedWithTeamId:6})).to.be.false;
        }]));

        it("Should return true when the share is public", inject(['ReelsFactory', function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(reel.isPublicShare(reel.getPublicShare())).to.be.true;
        }]));
    });

    describe('isFeatureSharedWithTeam', ()=> {
        it("Should throw error is the feature attribute is missing", inject(['ReelsFactory', function(ReelsFactory) {
                expect(()=>ReelsFactory.isFeatureSharedWithTeam()).to.throw(Error);
        }]));

        it("Should throw error if the feature is invalid attribute", inject(['ReelsFactory', function(ReelsFactory) {
                let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(()=>ReelsFactory.isFeatureSharedWithTeam(1)).to.throw(Error);
        }]));

        it("Should return false when the reel is not shared with the team", inject(['ReelsFactory', function(ReelsFactory) {
            let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(reel,'getShareByTeam').withArgs(team).returns(undefined);
            expect(reel.isFeatureSharedWithTeam('feature1', team)).to.be.false;
            assert(reel.getShareByTeam.should.have.been.called);
        }]));

        it("Should return false when the reel is shared, but the feature is not available", inject(['ReelsFactory', function(ReelsFactory) {
            let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(reel,'getShareByTeam').withArgs(team).returns({id:1, sharedWithTeamId:6});
            expect(reel.isFeatureSharedWithTeam('feature1', team)).to.be.false;
            assert(reel.getShareByTeam.should.have.been.called);
        }]));

        it("Should return false when the reel is shared, but the feature is not shared", inject(['ReelsFactory', function(ReelsFactory) {
            let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(reel,'getShareByTeam').withArgs(team).returns({id:1, sharedWithTeamId:6, 'feature1':false});
            expect(reel.isFeatureSharedWithTeam('feature1', team)).to.be.false;
            assert(reel.getShareByTeam.should.have.been.called);
        }]));

        it("Should return true when the reel is shared with the feature", inject(['ReelsFactory', function(ReelsFactory) {
            let reel = ReelsFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(reel,'getShareByTeam').withArgs(team).returns({id:1, sharedWithTeamId:6, 'feature1':true});
            expect(reel.isFeatureSharedWithTeam('feature1', team)).to.be.true;
            assert(reel.getShareByTeam.should.have.been.called);
        }]));
    });

    describe('isTelestrationsSharedWithTeam', ()=> {
        it("Should return true when shared", inject(['ReelsFactory', function(ReelsFactory) {
                let user = {id:9};
                sinon.stub(ReelsFactory,'isFeatureSharedWithTeam').withArgs('isTelestrationsShared',user).returns(true);
                expect(ReelsFactory.isTelestrationsSharedWithTeam(user)).to.be.true;
                assert(ReelsFactory.isFeatureSharedWithTeam.should.have.been.called);
        }]));

        it("Should return false when not shared", inject(['ReelsFactory', function(ReelsFactory) {
                let user = {id:9};
                sinon.stub(ReelsFactory,'isFeatureSharedWithTeam').withArgs('isTelestrationsShared',user).returns(false);
                expect(ReelsFactory.isTelestrationsSharedWithTeam(user)).to.be.false;
                assert(ReelsFactory.isFeatureSharedWithTeam.should.have.been.called);
        }]));
    });

    describe('isAllowedToView', ()=> {
        it("Should return false for athlete, when its not shared publicly, and not shared with user or team, and user doesnt belong to uploader team",
            inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE', function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                let teamId = 7;
                let user = UsersFactory.extend({id:9, roles:[{type:ROLE_TYPE.ATHLETE}]});
                let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                sinon.stub(reel,'isSharedWithPublic').returns(false);
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(session,'getCurrentUserId').returns(user.id);
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                expect(reel.isAllowedToView()).to.be.false;
                assert(reel.isSharedWithPublic.should.have.been.called);
                assert(session.getCurrentUser.should.have.been.called);
                assert(session.getCurrentUserId.should.have.been.called);
                assert(session.getCurrentTeamId.should.have.not.been.called);
                assert(reel.isSharedWithCurrentUser.should.have.been.called);
        }]));

        it("Should return false for coach, when its not shared publicly, and not shared with user or team, and user doesnt belong to uploader team",
            inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES', function(ReelsFactory, UsersFactory, session, ROLES) {
                let teamId = 7;
                let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                sinon.stub(reel,'isSharedWithPublic').returns(false);
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackGetCurrentUserId = sinon.stub(session,'getCurrentUserId');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:9, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackGetCurrentUserId.returns(user.id);
                    expect(reel.isAllowedToView()).to.be.false;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithPublic.should.have.been.called);
                    assert(session.getCurrentUserId.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.been.called);
                    assert(reel.isSharedWithCurrentUser.should.have.been.called);
                });
        }]));

        it("Should return true for athlete, when its shared publicly",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE', function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                    let teamId = 7;
                    let user = UsersFactory.extend({id:9, roles:[{type:ROLE_TYPE.ATHLETE}]});
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                    sinon.stub(reel,'isSharedWithPublic').returns(true);
                    sinon.stub(session,'getCurrentUser').returns(user);
                    sinon.stub(session,'getCurrentUserId').returns(user.id);
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                    expect(reel.isAllowedToView()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithPublic.should.have.been.called);
                    assert(session.getCurrentUserId.should.have.not.been.called);
                    assert(session.getCurrentTeamId.should.have.not.been.called);
                    assert(reel.isSharedWithCurrentUser.should.have.not.been.called);
        }]));

        it("Should return true for coach, when its shared publicly",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES', function(ReelsFactory, UsersFactory, session, ROLES) {
                    let teamId = 7;
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                    sinon.stub(reel,'isSharedWithPublic').returns(true);
                    let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                    let callbackGetCurrentUserId = sinon.stub(session,'getCurrentUserId');
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                    ROLES.COACH.type.id.forEach(type => {
                        let user = UsersFactory.extend({id:9, roles:[{type}]});
                        callbackGetCurrentUser.returns(user);
                        callbackGetCurrentUserId.returns(user.id);
                        expect(reel.isAllowedToView()).to.be.true;
                        assert(session.getCurrentUser.should.have.been.called);
                        assert(reel.isSharedWithPublic.should.have.been.called);
                        assert(session.getCurrentUserId.should.have.not.been.called);
                        assert(session.getCurrentTeamId.should.have.not.been.called);
                        assert(reel.isSharedWithCurrentUser.should.have.not.been.called);
                    });
        }]));

        it("Should return true for athlete, when its uploaded by the current user",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE', function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                    let teamId = 7;
                    let user = UsersFactory.extend({id:9, roles:[{type:ROLE_TYPE.ATHLETE}]});
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:user.id, uploaderTeamId:11});
                    sinon.stub(reel,'isSharedWithPublic').returns(false);
                    sinon.stub(session,'getCurrentUser').returns(user);
                    sinon.stub(session,'getCurrentUserId').returns(user.id);
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                    expect(reel.isAllowedToView()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithPublic.should.have.been.called);
                    assert(session.getCurrentUserId.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.not.been.called);
                    assert(reel.isSharedWithCurrentUser.should.have.not.been.called);
        }]));

        it("Should return true for coach, when its uploaded by the current user",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES', function(ReelsFactory, UsersFactory, session, ROLES) {
                    let teamId = 7;
                    let reel = ReelsFactory.extend({id:2, uploaderTeamId:11});
                    sinon.stub(reel,'isSharedWithPublic').returns(false);
                    let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                    let callbackGetCurrentUserId = sinon.stub(session,'getCurrentUserId');
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                    ROLES.COACH.type.id.forEach(type => {
                        let user = UsersFactory.extend({id:9, roles:[{type}]});
                        reel.uploaderUserId = user.id;
                        callbackGetCurrentUser.returns(user);
                        callbackGetCurrentUserId.returns(user.id);
                        expect(reel.isAllowedToView()).to.be.true;
                        assert(session.getCurrentUser.should.have.been.called);
                        assert(reel.isSharedWithPublic.should.have.been.called);
                        assert(session.getCurrentUserId.should.have.been.called);
                        assert(session.getCurrentTeamId.should.have.not.been.called);
                        assert(reel.isSharedWithCurrentUser.should.have.not.been.called);
                    });
        }]));

        it("Should return false for athlete, when uploaded by current user's team",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE', function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                    let teamId = 7;
                    let user = UsersFactory.extend({id:9, roles:[{type:ROLE_TYPE.ATHLETE}]});
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:teamId});
                    sinon.stub(reel,'isSharedWithPublic').returns(false);
                    sinon.stub(session,'getCurrentUser').returns(user);
                    sinon.stub(session,'getCurrentUserId').returns(user.id);
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                    expect(reel.isAllowedToView()).to.be.false;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithPublic.should.have.been.called);
                    assert(session.getCurrentUserId.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.not.been.called);
                    assert(reel.isSharedWithCurrentUser.should.have.been.called);
        }]));

        it("Should return true for coach, when uploaded by current user's team",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES', function(ReelsFactory, UsersFactory, session, ROLES) {
                    let teamId = 7;
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:teamId});
                    sinon.stub(reel,'isSharedWithPublic').returns(false);
                    let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                    let callbackGetCurrentUserId = sinon.stub(session,'getCurrentUserId');
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(false);
                    ROLES.COACH.type.id.forEach(type => {
                        let user = UsersFactory.extend({id:9, roles:[{type}]});
                        callbackGetCurrentUser.returns(user);
                        callbackGetCurrentUserId.returns(user.id);
                        expect(reel.isAllowedToView()).to.be.true;
                        assert(session.getCurrentUser.should.have.been.called);
                        assert(reel.isSharedWithPublic.should.have.been.called);
                        assert(session.getCurrentUserId.should.have.been.called);
                        assert(session.getCurrentTeamId.should.have.been.called);
                        assert(reel.isSharedWithCurrentUser.should.have.not.been.called);
                    });
        }]));

        it("Should return true for athlete, when its shared with the current user",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE', function(ReelsFactory, UsersFactory, session, ROLE_TYPE) {
                    let teamId = 7;
                    let user = UsersFactory.extend({id:9, roles:[{type:ROLE_TYPE.ATHLETE}]});
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                    sinon.stub(reel,'isSharedWithPublic').returns(false);
                    sinon.stub(session,'getCurrentUser').returns(user);
                    sinon.stub(session,'getCurrentUserId').returns(user.id);
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(true);
                    expect(reel.isAllowedToView()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(reel.isSharedWithPublic.should.have.been.called);
                    assert(session.getCurrentUserId.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.not.been.called);
                    assert(reel.isSharedWithCurrentUser.should.have.been.called);
        }]));

        it("Should return true for coach, when its shared with the current user",
                inject(['ReelsFactory', 'UsersFactory', 'SessionService', 'ROLES', function(ReelsFactory, UsersFactory, session, ROLES) {
                    let teamId = 7;
                    let reel = ReelsFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                    sinon.stub(reel,'isSharedWithPublic').returns(false);
                    let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                    let callbackGetCurrentUserId = sinon.stub(session,'getCurrentUserId');
                    sinon.stub(session,'getCurrentTeamId').returns(teamId);
                    sinon.stub(reel,'isSharedWithCurrentUser').returns(true);
                    ROLES.COACH.type.id.forEach(type => {
                        let user = UsersFactory.extend({id:9, roles:[{type}]});
                        callbackGetCurrentUser.returns(user);
                        callbackGetCurrentUserId.returns(user.id);
                        expect(reel.isAllowedToView()).to.be.true;
                        assert(session.getCurrentUser.should.have.been.called);
                        assert(reel.isSharedWithPublic.should.have.been.called);
                        assert(session.getCurrentUserId.should.have.been.called);
                        assert(session.getCurrentTeamId.should.have.been.called);
                        assert(reel.isSharedWithCurrentUser.should.have.been.called);
                    });
        }]));

    });
});
