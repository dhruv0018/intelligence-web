var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ReelsFactory', [
    'ROLES', 'Utilities', 'BaseFactory', 'SessionService', 'ReelTelestrationEntity',
    function(ROLES, utilities, BaseFactory, session, reelTelestrationEntity) {

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

                let copy = Object.assign({}, reel);

                // Remove circular object that cannot be stringified before PUT request
                delete copy.$promise;

                // Unextend any children objects
                Object.keys(copy).forEach(function assignCopies(key) {

                    if (copy[key] && copy[key].unextend) copy[key] = copy[key].unextend();
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

            /**
            * @class Reels
            * @method
            * @returns {Boolean} returns if user can view reel
            * or not.
            * Check if the user is allowed to view a given reel.
            */
            isAllowedToView: function() {

                let self = this;
                let currentUser = session.getCurrentUser();

                //Check if user has permissions to view reel
                let isAllowed = self.isSharedWithPublic() ||
                                self.uploaderUserId === session.getCurrentUserId() ||
                                (currentUser.is(ROLES.COACH) && self.uploaderTeamId === session.getCurrentTeamId()) ||
                                self.isSharedWithUser(session.getCurrentUser()) ||
                                self.isSharedWithTeam();

                return isAllowed;
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

            addPlays: function(playIds) {
                playIds.forEach(playId => this.plays.indexOf(playId) < 0 ? this.plays.push(playId) : undefined);
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

                if (!this.shares) return undefined;

                return this.shares.find(share => {

                    return !share.sharedWithUserId && !share.sharedWithTeamId;
                });
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

            /** FIXME: We should consolidate isSharedWithTeam
             *  and isSharedWithTeamId into one function,
             *  especially before unit tests
             */
            isSharedWithTeam: function() {
                var self = this;

                if (!self.shares) return false;

                return self.shares.map(function(share) {
                    return share.sharedWithTeamId;
                }).some(function(sharedWithTeamId) {
                    return sharedWithTeamId;
                });
            },
            isSharedWithTeamId: function(teamId) {

                var self = this;

                if (!teamId) return false;
                if (!self.shares) return false;

                return self.shares.map(function(share) {
                    return share.sharedWithTeamId;
                }).some(function(sharedWithTeamId) {
                    return teamId == sharedWithTeamId;
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
            isUploader: function (userId) {

                return userId === this.uploaderUserId;
            },
            /*
             * Determines if the team given is the same as the uploader's (owner) team
             * @param - teamId
             * @returns {boolean}
             */
            isTeamUploadersTeam: function (teamId) {

                return teamId === this.uploaderTeamId;
            },
            publishToProfile: function(user) {
                // Publishes this reel to a user's profile
                user = user || session.getCurrentUser();

                if (!user) throw new Error('No user');

                if (!this.isSharedWithPublic()) {
                    this.togglePublicSharing();
                }

                if (!this.isPublishedToProfile(user)) {
                    user.profile.reelIds.push(this.id);
                }
            },
            unpublishFromProfile: function(user) {
                // Unpublishes this reel from a user's profile
                user = user || session.getCurrentUser();

                if (!user) throw new Error('No user');

                if (this.isSharedWithPublic()) {
                    this.togglePublicSharing();
                }

                if (this.isPublishedToProfile(user)) {
                    user.profile.reelIds.forEach( (reelId, index) => {
                        if (reelId === this.id) {
                            user.profile.reelIds.splice(index, 1);
                        }
                    });
                }
            },
            isPublishedToProfile: function(user) {
                // Determines if this reel is on a user's profile
                user = user || session.getCurrentUser();

                if (!user) throw new Error('No user');

                let isPublished = false;

                user.profile.reelIds.forEach( reelId => {
                    if (this.id === reelId) {
                        isPublished = true;
                    }
                });

                return isPublished;
            },
            isFeatured: function(user) {

                user = user || session.getCurrentUser();

                return this.id === user.profile.reelIds[0];
            },
            getFeaturedReel: function(user) {

                user = user || session.getCurrentUser();

                if (!user) throw new Error('No user');

                let featuredReelId = user.profile.reelIds[0];

                return featuredReelId ? this.get(featuredReelId) : undefined;
            },
            getUserReels: function(userId, teamId) {

                userId = userId || session.getCurrentUserId();
                teamId = teamId || session.getCurrentTeamId();

                let userReels = [];

                if (session.currentUser.is(ROLES.COACH)) {

                    userReels = this.getByUploaderRole(userId, teamId);
                    userReels = userReels.concat(this.getByUploaderTeamId(teamId));
                }

                else if (session.currentUser.is(ROLES.ATHLETE)) {

                    userReels = this.getByUploaderUserId(userId);
                    userReels = userReels.filter(reel => !reel.uploaderTeamId);
                }

                return userReels;
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);
