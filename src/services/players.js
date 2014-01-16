var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PlayersFactory', [
    'PlayersResource',
    function(PlayersResource) {

        var PlayersFactory = {

            resource: PlayersResource,

            getList: function(filter, success, error) {

                var self = this;

                filter = filter || {};

                success = success || function(players) {

                    return players;
                };

                error = error || function() {

                    throw new Error('Could not load players list');
                };

                return this.resource.query(filter, success, error);
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

