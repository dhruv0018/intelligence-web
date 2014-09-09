var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('ReelsFactory', [
    'ReelsStorage', 'ReelsResource', 'BaseFactory',
    function(ReelsStorage, ReelsResource, BaseFactory) {

        var ReelsFactory = {

            description: 'reels',

            storage: ReelsStorage,

            resource: ReelsResource,

            extend: function(reel) {

                var self = this;

                angular.extend(reel, self);
                reel.plays = reel.plays || [];

                return reel;
            },

            addPlay: function(play) {
                this.plays.push(play.id);
            },

            updateDate: function() {
                this.updatedAt = moment.utc();
            },
            share: function share(toUserIds, reelId) {

                var self = this;
                var shareTime = new Date();

                self.shares = self.shares || [];

                reelId = (Number(reelId) >= 0) ? reelId : self.id;

                toUserIds = toUserIds || [];

                toUserIds.forEach(function(toUserId) {

                    if (!Number(toUserId) || toUserId < 0) return;

                    self.shares.push({
                        userId: session.currentUser.id,
                        reelId: reelId,
                        sharedWithUserId: toUserId,
                        /*sharedWithTeamId: undefined,*/
                        createdAt: shareTime
                    });
                });

                return self;
            },
            sharedBy: function sharedBy(sharedWithUserId) {
                var self = this;

                userId = Number(sharedWithUserId);

                if (!isNaN(userId)) {

                    //game has shares
                    if (self.sharedWithLookupTable) {
                        return (self.sharedWithLookupTable[userId]) ? self.sharedWithLookupTable[userId].userId : undefined;
                    }
                }
            },
            isSharedWith: function isSharedWith(userId) {
                return Number(sharedBy(userId)) >= 0;
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);

