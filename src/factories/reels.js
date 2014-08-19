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

            addPlay: function(play) {
                this.plays.push(play.id);
            }
        };

        angular.augment(ReelsFactory, BaseFactory);

        return ReelsFactory;
    }
]);

