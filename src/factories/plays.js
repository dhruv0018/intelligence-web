var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlaysFactory', [
    'PlaysResource', 'PlaysStorage', 'BaseFactory',
    function(PlaysResource, PlaysStorage, BaseFactory) {

        var PlaysFactory = {

            PAGE_SIZE: 1000,

            description: 'plays',

            storage: PlaysStorage,

            resource: PlaysResource,

            filterPlays: function(filterId, resources, success, error) {
                var self = this;
                var playIds = [];

                angular.forEach(resources.plays, function(play) {
                    playIds.push(play.id);
                });

                var filter = {
                    plays: {},
                    options: {
                        teamId: resources.teamId,
                        playerId: resources.playerId
                    }
                };

                filter.plays[resources.game.id] = playIds;

                var newPlayList = new PlaysResource(filter);

                var callback = success || function(plays) {
                    return plays;
                };

                error = error || function() {
                    throw new Error('could not filter plays');
                };

                return newPlayList.$filter({filterId: filterId.filterId}, callback, error);
            }
        };

        angular.augment(PlaysFactory, BaseFactory);

        return PlaysFactory;
    }
]);
