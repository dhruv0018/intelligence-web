var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlaysFactory', [
    'PlaysResource', 'PlaysStorage', 'BaseFactory',
    function(PlaysResource, PlaysStorage, BaseFactory) {

        var PlaysFactory = {

            description: 'plays',

            storage: PlaysStorage,

            resource: PlaysResource,

            filterPlays: function(filterId, resources, success, error) {
                var self = this;
                console.log(resources);
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
            },

            save: function(play) {

                var self = this;

                play = play || self;

                play.startTime = play.events

                .map(function(event) {

                    return angular.isNumber(event.time) ? event.time : 0;
                })

                .reduce(function(previous, current) {

                    return previous < current ? previous : current;
                });

                play.endTime = play.events

                .map(function(event) {

                    return angular.isNumber(event.time) ? event.time : 0;
                })

                .reduce(function(previous, current) {

                    return previous > current ? previous : current;
                });

                if (play.id) {

                    var updatePlay = new PlaysResource(play);

                    updatePlay.events = play.events.map(function(event) {

                        event.playId = play.id;

                        delete event.tag;
                        delete event.activeEventVariableIndex;

                        return event;
                    });

                    updatePlay = self.unextend(updatePlay);

                    return updatePlay.$update().then(function(play) {

                        play = self.extend(play);
                        return play;
                    });

                } else {

                    var events = play.events;
                    var newPlay = new PlaysResource(play);

                    delete newPlay.events;

                    newPlay = self.unextend(newPlay);

                    return newPlay.$create().then(function(play) {

                        play.events = events;
                        return self.save(play);
                    });
                }
            },

            remove: function(play, success, error) {

                var self = this;

                var parameters = {};

                play = play || self;

                success = success || function(play) {

                    return self.extend(play);
                };

                error = error || function() {

                    throw new Error('Could not remove play');

                };

                if (play.id) {

                    var deletedPlay = self.resource.remove(parameters, play, success, error);
                    return deletedPlay.$promise;

                } else {

                    throw new Error('Can not remove play from server that has not been previously saved remotely');
                }
            }
        };

        angular.augment(PlaysFactory, BaseFactory);

        return PlaysFactory;
    }
]);
