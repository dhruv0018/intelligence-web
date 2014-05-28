var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlaysFactory', [
    'PlaysResource',
    function(PlaysResource) {

        var PlaysFactory = {

            resource: PlaysResource,

            extendPlay: function(play) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "play" object. */
                angular.extend(play, self);

                if (play.events) {

                    play.events = play.events.map(function(event) {

                        var indexedVariableValues = {};

                        for (var key in event.variableValues) {

                            var value = event.variableValues[key];
                            indexedVariableValues[value.index] = value;
                        }

                        event.variableValues = indexedVariableValues;

                        return event;
                    });
                }

                return play;
            },

            getList: function(gameId, success, error, index) {

                var self = this;

                var callback = function(plays) {

                    var indexedPlays = {};

                    plays.forEach(function(play) {

                        play = self.extendPlay(play);

                        indexedPlays[play.id] = play;
                    });

                    plays = index ? indexedPlays : plays;

                    return success ? success(plays) : plays;
                };

                error = error || function(response) {

                    if (response.status === 404) return [];

                    else throw new Error('Could not load plays list');
                };

                return self.resource.query({gameId: gameId}, callback, error);
            },

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

                        delete event.activeEventVariableIndex;

                        var indexedVariableValues = {};

                        for (var key in event.variableValues) {

                            var value = event.variableValues[key];
                            indexedVariableValues[value.id] = value;
                        }

                        event.variableValues = indexedVariableValues;

                        return event;
                    });

                    return updatePlay.$update().then(function(play) {

                        play = self.extendPlay(play);
                        return play;
                    });

                } else {

                    var events = play.events;
                    var newPlay = new PlaysResource(play);

                    delete newPlay.events;

                    return newPlay.$create().then(function(play) {

                        play = self.extendPlay(play);
                        play.events = events;
                        return play.save();
                    });
                }
            },

            remove: function(play, success, error) {

                var self = this;

                var parameters = {};

                play = play || self;

                success = success || function(play) {

                    return self.extendPlay(play);
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

        return PlaysFactory;
    }
]);
