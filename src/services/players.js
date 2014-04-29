var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$q', 'PlayersResource',
    function($q, PlayersResource) {

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

                var self = this;

                if (!rosterId) throw new Error('No roster ID');
                if (!players) throw new Error('No players to save');

                var filter = { roster: rosterId };

                var currentPlayers = players.filter(function(player) {

                    return player.id;
                });

                var newPlayers = players.filter(function(player) {

                    return !player.id;
                });

                newPlayers = newPlayers.map(function(player) {

                    player.rosterIds = [rosterId];

                    return player;
                });

                if (!!newPlayers.length) {

                    newPlayers = self.resource.create(newPlayers).$promise;
                }

                currentPlayers = currentPlayers.map(function(player) {

                    return self.resource.update(player).$promise;
                });

                var allPlayers = currentPlayers.concat(newPlayers);

                return $q.all(allPlayers).then(function() {

                    return self.getList(filter).$promise;
                });
            }
        };

        return PlayersFactory;
    }
]);

