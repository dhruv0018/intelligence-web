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
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);

