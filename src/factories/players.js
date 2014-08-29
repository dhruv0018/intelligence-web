var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$q', 'PlayersResource', 'PlayersStorage', 'BaseFactory',
    function($q, PlayersResource, PlansStorage, BaseFactory) {

        var PlayersFactory = {

            description: 'players',

            storage: PlansStorage,

            resource: PlayersResource,
            extend: function(resource) {

                var self = this;
                //TODO fix me
                if (window.Array.isArray(self.positionIds) && self.positionIds.length === 0) {
                    self.positionIds = {};
                }
                angular.extend(resource, self);

                return resource;
            },
            singleSave: function(rosterId, player) {
                var self = this;

                player.rosterIds = [rosterId];
                delete player.resource;
                delete player.storage;

                if (player.id) {
                    return self.resource.update(player).$promise;
                } else {
                    return self.resource.singleCreate(player).$promise.then(function(player) {
                        angular.extend(player, self);
                        return player;
                    });
                }

            },

            save: function(rosterId, players) {

                var self = this;

                if (!rosterId) throw new Error('No roster ID');
                if (!players) throw new Error('No players to save');

                var filter = { rosterId: rosterId };

                var currentPlayers = players.filter(function(player) {
                    return player.id;
                }).map(function(player) {
                    delete player.resource;
                    delete player.storage;

                    return player;
                });

                var newPlayers = players.filter(function(player) {

                    return !player.id;
                });

                newPlayers = newPlayers.map(function(player) {
                    delete player.resource;
                    delete player.storage;

                    player.rosterIds = [rosterId];

                    return player;
                });

                if (newPlayers.length) {

                    newPlayers = self.resource.create(newPlayers).$promise;
                }

                currentPlayers = currentPlayers.map(function(player) {

                    return self.resource.update(player).$promise;
                });

                var allPlayers = currentPlayers.concat(newPlayers);

                return $q.all(allPlayers).then(function() {

                    return self.query(filter);
                });
            },
            resendEmail: function(userId, teamId) {
                var self = this;

                return self.resource.resendEmail({
                    userId: userId,
                    teamId: teamId
                });
            },
            toggleActivation: function(rosterId) {
                this.rosterStatuses[rosterId] = !this.rosterStatuses[rosterId];
            },
            constructActiveRoster: function(roster, rosterId) {
                return roster.filter(function(player) {
                    return player.rosterStatuses[rosterId] === true;
                });
            }
        };

        angular.augment(PlayersFactory, BaseFactory);

        return PlayersFactory;
    }
]);

