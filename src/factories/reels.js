var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ReelsFactory', [
    'ROLES', 'Utilities', 'BaseFactory', 'SessionService',
    function(ROLES, utilities, BaseFactory, session) {

        var ReelsFactory = {

            description: 'reels',

            model: 'ReelsResource',

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

                return reel;
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

            addPlays: function(playIds) {
                playIds.forEach( playId => {
                    if (this.plays.indexOf(playId) === -1) {
                        this.plays.push(playId);
                    }
                });
            },

            updateDate: function() {
                this.updatedAt = moment.utc().toDate();
            },
            shareWithUser: function(user) {

                var self = this;

                if (!user) throw new Error('No user to share with');

                self.shares = self.shares || [];

                self.sharedWithUsers = self.sharedWithUsers || {};

                if (self.isSharedWithUser(user)) return;

                var share = {
                    userId: session.currentUser.id,
                    reelId: self.id,
                    sharedWithUserId: user.id,
                    createdAt: moment.utc().toDate()
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
            getUserShares: function() {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                var sharesArray = [];

                angular.forEach(self.sharedWithUsers, function(share, index) {
                    sharesArray.push(share);
                });

                return sharesArray;
            },
            togglePublicSharing: function() {
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
                        createdAt: moment.utc().toDate()
                    };

                    self.shares.push(share);
                }
            },
            isSharedWithPublic: function() {
                var self = this;

                if (!self.shares) return false;

                return self.shares.map(function(share) {
                    return share.sharedWithUserId;
                }).some(function(userId) {
                    return !userId;
                });
            },
            toggleTeamShare: function(teamId) {
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
                        createdAt: moment.utc().toDate()
                    };

                    self.shares.push(share);
                }
            },

            /* FIXME: Should this be checking for a specific teamId? */
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
            publishToProfile: function() {
                var self = this;

                if (!self.isSharedWithPublic()) {
                    self.togglePublicSharing();
                }

                self.isPublishedToProfile = true;
            },
            unpublishFromProfile: function() {
                var self = this;

                if (self.isSharedWithPublic()) {
                    self.togglePublicSharing();
                }

                self.isPublishedToProfile = false;
            },
            getPublishedReels: function(userId) {
                userId = userId || session.getCurrentUserId();

                if (!userId) throw new Error('No userId');

                var reels = this.getList();

                return reels.filter(function publishedReels(reel) {

                    return reel.uploaderUserId == userId &&
                        reel.isPublishedToProfile === true;
                });
            },
            isFeatured: function(user) {
                var self = this;
                user = user || session.getCurrentUser();

                return self.id == user.profile.featuredReelId;
            },
            getFeaturedReel: function(user) {

                user = user || session.getCurrentUser();

                if (!user) throw new Error('No user');

                let featuredReelId = user.profile.featuredReelId;

                return featuredReelId ? this.get(featuredReelId) : undefined;
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);
