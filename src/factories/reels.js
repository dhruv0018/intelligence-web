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
                reel.sharedWithTeams = reel.sharedWithTeams || {};
                reel.isDeleted = reel.isDeleted || false;

                /* build lookup table of shares by userId shared with */
                //TODO find out why this doesnt look for a public share
                if (reel.shares && reel.shares.length) {

                    angular.forEach(reel.shares, function(share) {
                        if (share.sharedWithUserId) {
                            reel.sharedWithUsers[share.sharedWithUserId] = share;
                        } else if (share.sharedWithTeamId) {
                            reel.sharedWithTeams[share.sharedWithTeamId] = share;
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

                //Check if user has permissions to view reel
                return this.isSharedWithPublic() ||
                        this.uploaderUserId === session.getCurrentUserId() ||
                        (currentUser.is(ROLES.COACH) && this.uploaderTeamId === session.getCurrentTeamId()) ||
                        this.isSharedWithCurrentUser(session.currentUser);

            },
            getByRelatedRole:function(userId, teamId) {

                userId = userId || session.getCurrentUserId();
                teamId = teamId || session.getCurrentTeamId();

                var reels = [];

                if (session.currentUser.is(ROLES.COACH)) {

                    reels = reels.concat(
                            this.getByUploaderRole(userId, teamId),
                            this.getByUploaderTeamId(teamId),
                            this.getBySharedWithTeamId(teamId));
                }

                else if (session.currentUser.is(ROLES.ATHLETE)) {

                    reels = reels.concat(this.getByUploaderUserId(userId));

                    reels = reels.filter(function(reel) {

                        return !reel.uploaderTeamId;
                    });
                }

                reels = reels.concat(this.getBySharedWithUserId(userId));
                reels = reels.concat(this.getBySharedWithTeamId(teamId));

                var reelIds = utilities.unique(this.getIds(reels));

                return this.getList(reelIds);
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
                    isTelestrationsShared
                };

                self.sharedWithUsers[user.id] = share;

                self.shares.push(share);
            },

            /**
             * share reel with team
             * @param {Object} team - team to be shared with
             * @param {boolean} isTelestrationsShared
             * @throws {Error} if the team is not avaliable to share.
             */
            shareWithTeam: function(team, isTelestrationsShared = false) {

                if (!team) throw new Error('No team to share with');

                this.shares = this.shares || [];

                this.sharedWithTeams = this.sharedWithTeams || {};

                if (this.isSharedWithTeam(team)) return;

                const share = {
                    userId: session.currentUser.id,
                    reelId: this.id,
                    sharedWithTeamId: team.id,
                    createdAt: moment.utc().toDate(),
                    isTelestrationsShared
                };

                this.sharedWithTeams[team.id] = share;

                this.shares.push(share);
            },

            /**
             * stop sharing reel
             * @param {Object} share - shared with object
             * @throws {Error} if the share object is not avaliable.
             */
            stopSharing: function(share) {

                if (!share) throw new Error('No share to remove');

                if (!this.shares || !this.shares.length) return;

                for (var index = 0; index < this.shares.length; index++) {
                    if ((this.shares[index].sharedWithUserId === share.sharedWithUserId) &&
                            (this.shares[index].sharedWithTeamId === share.sharedWithTeamId)) {
                        this.shares.splice(index, 1);
                        if (share.sharedWithUserId) {
                            delete this.sharedWithUsers[share.sharedWithUserId];
                        }
                        if (share.sharedWithTeamId) {
                            delete this.sharedWithTeams[share.sharedWithTeamId];
                        }
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

            /**
             * get reel sharing by team
             * @param {Object} team - shared with team
             * @throws {Error} if the sharedWithTeams or team objects are not avaliable.
             * @return {Object}
             */
            getShareByTeam: function(team) {
                if (!this.sharedWithTeams) throw new Error('sharedWithTeams not defined');

                if (!team) throw new Error('No team to get share from');

                return this.getShareByTeamId(team.id);
            },
            getShareByUserId: function(userId) {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                return self.sharedWithUsers[userId];
            },

            /**
             * get reel sharing by teamId
             * @param {Integer} teamId - shared with team
             * @throws {Error} if the sharedWithTeams are not avaliable.
             * @return {Object}
             */
            getShareByTeamId: function(teamId) {
                if (!this.sharedWithTeams) throw new Error('sharedWithTeams not defined');

                return this.sharedWithTeams[teamId];
            },
            isSharedWithUser: function(user) {
                var self = this;

                if (!user) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUser(user));
            },

            /**
             * check reel shared with team
             * @param {Object} team - shared with team
             * @return {boolean}
             */
            isSharedWithTeam: function(team) {
                if (!team) return false;

                if (!this.sharedWithTeams) return false;

                return angular.isDefined(this.getShareByTeam(team));
            },

            /**
             * check reel shared with loggedin user
             * @return {boolean}
             */
            isSharedWithCurrentUser: function() {

                return this.isSharedWithUser(session.getCurrentUser()) ||
                        ((session.currentUser.is(ROLES.COACH)) && self.isSharedWithTeamId(session.getCurrentTeamId()));
            },

            isSharedWithUserId: function(userId) {
                var self = this;

                if (!userId) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUserId(userId));
            },

            /**
             * check reel shared with teamId
             * @param {Integer} teamId - shared with team
             * @return {boolean}
             */
            isSharedWithTeamId: function(teamId) {
                if (!teamId) return false;

                if (!this.sharedWithTeams) return false;

                return angular.isDefined(this.getShareByTeamId(teamId));
            },
            isTelestrationsSharedWithUser: function(user) {
                var self = this;

                return self.isFeatureSharedWithUser('isTelestrationsShared', user);
            },

            /**
             * check teletration for reel are shared with team
             * @param {Object} team - shared with team
             * @return {boolean}
             */
            isTelestrationsSharedWithTeam: function(team) {
                const self = this;

                return self.isTelestrationsSharedWithTeam('isTelestrationsShared', team);
            },
            isTelestrationsSharedPublicly: function() {
                return this.isFeatureSharedPublicly('isTelestrationsShared');
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

            /**
             * get team shares of reel
             * @return {Array}
             */
            getTeamShares: function() {
                if (!this.sharedWithTeams) throw new Error('sharedWithTeams not defined');

                return self.sharedWithTeams.map(share => angular.copy(share));
            },

            /**
             * get all shares excluding the public share
             * @return {Array}
             */
            getNonPublicShares: function() {
                let sharesArray = [];
                const self = this;
                self.shares.forEach(function(share) {
                    if (!self.isPublicShare(share)) {
                        sharesArray.push(share);
                    }
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
                        isTelestrationsShared
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

            /**
             * check if the share is public share object
             * @param {Object} share
             * @return {boolean}
             */
            isPublicShare: function(share) {
                return share === this.getPublicShare();
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

            /**
             * check a feature of reel is shared with team
             * @param {Object} team - shared with team
             * @return {boolean}
             */
            isFeatureSharedWithTeam: function(featureAttribute, team) {

                if (!featureAttribute) throw new Error('Missing \'featureAttribute\' parameter');
                if (typeof featureAttribute !== 'string') throw new Error('featureAttribute parameter must be a string');

                const teamShare = this.getShareByTeam(team);

                return angular.isDefined(teamShare) && teamShare[featureAttribute];
            },
            toggleTeamShare: function(teamId, isTelestrationsShared = false) {
                var self = this;

                if (!teamId) throw new Error('No team id');

                self.shares = self.shares || [];

                if (self.isSharedWithTeamId(teamId)) {
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
                        isTelestrationsShared
                    };

                    self.shares.push(share);
                }
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

                return user.profile.reelIds.some(reelId => this.id === reelId);
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
