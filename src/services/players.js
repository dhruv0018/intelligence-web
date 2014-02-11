var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PlayersFactory', [
    'PlayersResource',
    function(PlayersResource) {

        var PlayersFactory = {

            resource: PlayersResource,

            extendPlayer: function(player) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "player" object. */
                angular.extend(player, self);

                return player;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(player) {

                    player = self.extendPlayer(player);

                    return success ? success(player) : player;
                };

                error = error || function() {

                    throw new Error('Could not get player');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};

                var callback = function(players) {

                    var indexedPlayers = {};

                    players.forEach(function(player) {

                        player = self.extendPlayer(player);

                        indexedPlayers[player.id] = player;
                    });

                    players = index ? indexedPlayers : players;

                    return success ? success(players) : players;
                };

                error = error || function() {

                    throw new Error('Could not load players list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(rosterId, players) {

                /* Filter out players which are marked as did not play. */
                players = players.filter(function(player) {

                    return player.played;
                });

                /* Modify players. */
                players = players.map(function(player) {

                    /* Split name into first and last if its given. */
                    if (player.name) {

                        player.firstName = player.name.split(' ').shift();
                        player.lastName = player.name.split(' ').pop();
                    }

                    player.rosterIds = player.rosterIds || [];

                    /* If the given rosterId is not present in the list then add it. */
                    if (player.rosterIds.indexOf(rosterId) === -1) player.rosterIds.push(rosterId);

                    return player;
                });

                var newPlayers = this.resource.create(players);
                return newPlayers.$promise;
            }
        };

        return PlayersFactory;
    }
]);

