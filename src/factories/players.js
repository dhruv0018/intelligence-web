var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$injector', '$q', 'PlayersResource', 'PlayersStorage', 'BaseFactory',
    function($injector, $q, PlayersResource, PlayersStorage, BaseFactory) {

        var PlayersFactory = {

            description: 'players',

            model: 'PlayersResource',

            storage: 'PlayersStorage',

            singleSave: function(rosterId, player) {
                var self = this;

                player.rosterIds = [rosterId];

                var model = $injector.get(self.model);

                if (player.id) {
                    return model.update(player).$promise;
                } else {
                    return model.singleCreate(player).$promise.then(function(player) {
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

                var model = $injector.get(self.model);

                if (newPlayers.length) {

                    newPlayers = model.create(newPlayers).$promise;
                }

                currentPlayers = currentPlayers.map(function(player) {

                    return model.update(player).$promise;
                });

                var allPlayers = currentPlayers.concat(newPlayers);

                return $q.all(allPlayers).then(function() {

                    return self.query(filter);
                });
            },
            resendEmail: function(userId, teamId) {
                var self = this;

                var model = $injector.get(self.model);

                return model.resendEmail({
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

