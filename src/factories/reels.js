var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('ReelsFactory', [
    'BaseFactory',
    function(BaseFactory) {

        var ReelsFactory = {

            description: 'reels',

            model: 'ReelsResource',

            storage: 'ReelsStorage',

            extend: function(reel) {

                var self = this;

                angular.extend(reel, self);
                reel.plays = reel.plays || [];

                /* build lookup table of shares by userId shared with */
                if (reel.shares && reel.shares.length) {
                    reel.sharedWithUsers = reel.sharedWithUsers || {};

                    angular.forEach(reel.shares, function(share) {
                        if (share.sharedWithUserId) {
                            reel.sharedWithUsers[share.sharedWithUserId] = share;
                        }
                    });
                }

                return reel;
            },

            addPlay: function(play) {
                if (this.plays.indexOf(play.id) === -1) {
                    this.plays.push(play.id);
                }
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

                return self.sharedWithUsers[userId];
            },
            isSharedWithUser: function(user) {
                var self = this;

                if (!user) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUser(user));
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
            shareWithPublic: function() {
                var self = this;

                self.shares = self.shares || [];

                if (self.isSharedWithPublic()) return;

                var share = {
                    userId: session.currentUser.id,
                    reelId: self.id,
                    sharedWithUserId: null,
                    createdAt: moment.utc().toDate()
                };

                self.shares.push(share);
            },
            stopSharingWithPublic: function() {
                var self = this;

                if (!self.shares || !self.shares.length) return;

                self.shares.forEach(function(share, index) {
                    if (!share.sharedWithUserId) {
                        self.shares.splice(index, 1);
                    }
                });
            },
            isSharedWithPublic: function() {
                var self = this;

                if (!self.shares) return false;

                return self.shares.map(function(share) {
                    return share.sharedWithUserId;
                }).some(function(userId) {
                    return !userId;
                });
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);

