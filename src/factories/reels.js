var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ReelsFactory', [
    'ROLES', 'Utilities', 'BaseFactory', 'SessionService', 'ReelTelestrationEntity', 'CUEPOINT_TYPES',
    function(ROLES, utilities, BaseFactory, session, reelTelestrationEntity, CUEPOINT_TYPES) {

        var ReelsFactory = {

            description: 'reels',

            model: 'ReelsResource',

            schema: 'REEL_SCHEMA',

            storage: 'ReelsStorage',

            extend: function(reel) {

                var self = this;

                angular.extend(reel, self);
                reel.plays = reel.plays || [];
                reel.shares = reel.shares || [];
                reel.sharedWithUsers = reel.sharedWithUsers || {};
                reel.isDeleted = reel.isDeleted || false;

                /* build lookup table of shares by userId shared with */
                //TODO find out why this doesnt look for a public share
                if (reel.shares && reel.shares.length) {

                    angular.forEach(reel.shares, function(share) {
                        if (share.sharedWithUserId) {
                            reel.sharedWithUsers[share.sharedWithUserId] = share;
                        }
                    });
                }

                // Extend Telestration Entities
                reel.telestrations = reel.telestrations || [];

                if (!reel.telestrations.unextend) reelTelestrationEntity(reel.telestrations, reel.id);

                return reel;
            },

            unextend: function(reel) {

                var self = this;

                reel = reel || self;

                /* Create a copy of the resource to break reference to original. */

                let copy = {};

                delete reel.$promise; // cannot stringify a circular object, thus remove

                // Unextend any children objects, and copy other attributes. TODO: Add validation to children
                Object.keys(reel).forEach(function assignCopies(key) {

                    if (reel[key] && reel[key].unextend) copy[key] = reel[key].unextend();
                    else if (reel[key] && typeof reel[key] !== 'function') copy[key] = JSON.parse(JSON.stringify(reel[key]));
                });

                return copy;
            },

            getByUploaderUserId: function(userId) {

                userId = userId || session.getCurrentUserId();

                if (!userId) throw new Error('No userId');

                var reels = this.getList();

                return reels.filter(function(reel) {

                    return reel.uploaderUserId == userId;
                });
            },

            getByUploaderTeamId: function(teamId) {

                teamId = teamId || session.getCurrentTeamId();

                if (!teamId) throw new Error('No teamId');

                var reels = this.getList();

                return reels.filter(function(reel) {

                    return reel.uploaderTeamId == teamId;
                });
            },

            getByUploaderRole: function(userId, teamId) {

                userId = userId || session.getCurrentUserId();
                teamId = teamId || session.getCurrentTeamId();

                if (!userId) throw new Error('No userId');
                if (!teamId) throw new Error('No teamId');

                var reels = this.getList();

                return reels.filter(function(reel) {

                    return reel.uploaderUserId == userId &&
                        reel.uploaderTeamId == teamId;
                });
            },

            getBySharedWithUser: function(user) {

                user = user || session.currentUser;

                var reels = this.getList();

                return reels.filter(function(reel) {

                    return reel.isSharedWithUser(user);
                });
            },

            getBySharedWithUserId: function(userId) {

                var self = this;

                userId = userId || session.getCurrentUserId();

                var reels = self.getList();

                return reels.filter(function(reel) {

                    return reel.isSharedWithUserId(userId);
                });
            },

            getBySharedWithTeamId: function(teamId) {

                teamId = teamId || session.getCurrentTeamId();

                var reels = this.getList();

                return reels.filter(function(reel) {

                    return reel.isSharedWithTeamId(teamId);
                });
            },

            getByRelatedRole:function(userId, teamId) {

                var self = this;

                userId = userId || session.getCurrentUserId();
                teamId = teamId || session.getCurrentTeamId();

                var reels = [];

                if (session.currentUser.is(ROLES.COACH)) {

                    reels = reels.concat(self.getByUploaderRole(userId, teamId));
                    reels = reels.concat(self.getByUploaderTeamId(teamId));
                }

                else if (session.currentUser.is(ROLES.ATHLETE)) {

                    reels = reels.concat(self.getByUploaderUserId(userId));

                    reels = reels.filter(function(reel) {

                        return !reel.uploaderTeamId;
                    });
                }

                reels = reels.concat(self.getBySharedWithUserId(userId));
                reels = reels.concat(self.getBySharedWithTeamId(teamId));

                var reelIds = utilities.unique(self.getIds(reels));

                return self.getList(reelIds);
            },

            addPlay: function(play) {
                if (this.plays.indexOf(play.id) === -1) {
                    this.plays.push(play.id);
                }
            },

            updateDate: function() {
                this.updatedAt = moment.utc().toDate();
            },
            shareWithUser: function(user, isTelestrationsShared = false) {

                var self = this;

                if (!user) throw new Error('No user to share with');

                self.shares = self.shares || [];

                self.sharedWithUsers = self.sharedWithUsers || {};

                if (self.isSharedWithUser(user)) return;

                var share = {
                    userId: session.currentUser.id,
                    reelId: self.id,
                    sharedWithUserId: user.id,
                    createdAt: moment.utc().toDate(),
                    isTelestrationsShared: isTelestrationsShared
                };

                self.sharedWithUsers[user.id] = share;

                self.shares.push(share);
            },
            stopSharingWithUser: function(user) {

                var self = this;

                if (!user) throw new Error('No user to remove');

                if (!self.shares || !self.shares.length) return;

                for (var index = 0; index < self.shares.length; index++) {
                    if (self.shares[index].sharedWithUserId === user.id) {
                        self.shares.splice(index, 1);
                        delete self.sharedWithUsers[user.id];
                        return;
                    }
                }
            },
            getShareByUser: function(user) {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                if (!user) throw new Error('No user to get share from');

                var userId = user.id;

                return self.getShareByUserId(userId);
            },
            getShareByUserId: function(userId) {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                return self.sharedWithUsers[userId];
            },
            isSharedWithUser: function(user) {
                var self = this;

                if (!user) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUser(user));
            },
            isSharedWithUserId: function(userId) {
                var self = this;

                if (!userId) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUserId(userId));
            },
            isTelestrationsSharedWithUser: function(user) {
                var self = this;

                return self.isFeatureSharedWithUser('isTelestrationsShared', user);
            },
            isTelestrationsSharedPublicly: function() {
                var self = this;

                return self.isFeatureSharedPublicly('isTelestrationsShared');
            },
            getUserShares: function() {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                var sharesArray = [];

                angular.forEach(self.sharedWithUsers, function(share, index) {
                    sharesArray.push(share);
                });

                return sharesArray;
            },
            togglePublicSharing: function(isTelestrationsShared = false) {
                var self = this;

                self.shares = self.shares || [];

                if (self.isSharedWithPublic()) {
                    self.shares.forEach(function(share, index) {
                        if (!share.sharedWithUserId) {
                            self.shares.splice(index, 1);
                        }
                    });
                } else {
                    var share = {
                        userId: session.currentUser.id,
                        reelId: self.id,
                        sharedWithUserId: null,
                        createdAt: moment.utc().toDate(),
                        isTelestrationsShared: isTelestrationsShared
                    };

                    self.shares.push(share);
                }
            },
            getPublicShare: function() {
                var self = this;

                if (!self.shares) return false;

                var publicShare = self.shares.filter(function(share) {
                    if (!share.sharedWithUserId && !share.sharedWithTeamId) return true;
                });

                if (publicShare.length) return publicShare;
            },
            isSharedWithPublic: function() {
                var self = this;

                if (!self.shares) return false;

                var publicShare = self.getPublicShare();

                if (angular.isDefined(publicShare)) return true;
            },
            isFeatureSharedPublicly: function(featureAttribute) {
                var self = this;

                if (!featureAttribute) throw new Error('Missing \'featureAttribute\' parameter');
                if (typeof featureAttribute !== 'string') throw new Error('featureAttribute parameter must be a string');

                var publicShare = self.getPublicShare();

                if (angular.isDefined(publicShare) && publicShare[featureAttribute] === true) return true;
            },
            isFeatureSharedWithUser: function(featureAttribute, user) {
                var self = this;

                if (!featureAttribute) throw new Error('Missing \'featureAttribute\' parameter');
                if (typeof featureAttribute !== 'string') throw new Error('featureAttribute parameter must be a string');

                var userShare = self.getShareByUser(user);

                if (angular.isDefined(userShare) && userShare[featureAttribute] === true) return true;
            },
            toggleTeamShare: function(teamId, isTelestrationsShared = false) {
                var self = this;

                if (!teamId) throw new Error('No team id');

                self.shares = self.shares || [];

                if (self.isSharedWithTeam()) {
                    self.shares.forEach(function(share, index) {
                        if (share.sharedWithTeamId) {
                            self.shares.splice(index, 1);
                        }
                    });
                } else {

                    var share = {
                        userId: session.currentUser.id,
                        reelId: self.id,
                        sharedWithTeamId: teamId,
                        createdAt: moment.utc().toDate(),
                        isTelestrationsShared: isTelestrationsShared
                    };

                    self.shares.push(share);
                }
            },
            isSharedWithTeam: function() {
                var self = this;

                if (!self.shares) return false;

                return self.shares.map(function(share) {
                    return share.sharedWithTeamId;
                }).some(function(teamId) {
                    return teamId;
                });
            },
            isSharedWithTeamId: function(teamId) {

                var self = this;

                if (!teamId) return false;
                if (!self.shares) return false;

                return self.shares.map(function(share) {
                    return share.sharedWithTeamId;
                }).some(function(teamId) {
                    return teamId == teamId;
                });
            },
            getTeamShare: function() {
                var self = this;

                if (!self.shares) throw new Error('No shares found');

                var teamShare = null;

                if (self.isSharedWithTeam()) {
                    self.shares.forEach(function(share, index) {
                        if (share.sharedWithTeamId) {
                            teamShare = share;
                        }
                    });
                }

                return teamShare;
            },
            /*
             * Determines if the user is the uploader (owner) of this game
             * @param - userId
             * @returns {boolean}
             */
            isUploader: function isUploader(userId) {
                var self = this;

                return userId === self.uploaderUserId;
            },
            /*
             * Determines if the team given is the same as the uploader's (owner) team
             * @param - teamId
             * @returns {boolean}
             */
            isTeamUploadersTeam: function isTeamUploadersTeam(teamId) {
                var self = this;

                return teamId === self.uploaderTeamId;
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);
