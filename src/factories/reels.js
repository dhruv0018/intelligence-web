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
                        reel.sharedWithUsers[share.sharedWithUserId] = share;
                    });
                }

                return reel;
            },

            addPlay: function(play) {
                this.plays.push(play.id);
            },

            updateDate: function() {
                this.updatedAt = new Date();
            },
            shareWithUser: function(user) {

                var self = this;

                if (!user) throw new Error('No user to share with');

                self.shares = self.shares || [];

                self.sharedWithUsers = self.sharedWithUsers || {};

                if (self.isSharedWithUser(user)) return;

                var share = {
                    userId: session.currentUser.id,
                    gameId: self.id,
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
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);

