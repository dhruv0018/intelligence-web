var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$injector', '$q', 'BaseFactory',
    function($injector, $q, BaseFactory) {

        var PlayersFactory = {

            description: 'players',

            model: 'PlayersResource',

            storage: 'PlayersStorage',

            extend: function(player) {

                var self = this;
                angular.extend(player, self);

                // FIXME
                if (angular.isArray(player.positionIds)) {
                    player.positionIds = {};
                }

                return player;
            },
            resendEmail: function(userId, teamId) {
                var self = this;

                var model = $injector.get(self.model);

                return model.resendEmail({
                    userId: userId,
                    teamId: teamId
                });
            },
            toggleActivation: function(team) {
                var self = this;
                team.roster.playerInfo[self.id].isActive = !team.roster.playerInfo[self.id].isActive;
            },
            constructActiveRoster: function(roster, rosterId) {
                return roster.filter(function(player) {
                    return player.rosterStatuses[rosterId] === true;
                });
            },
            transferPlayerInformation: function(fromRosterId, toRosterId) {

                var self = this;

                //if the player is active
                if (self.rosterStatuses[fromRosterId]) {
                    self.rosterIds.push(toRosterId);
                    self.jerseyNumbers[toRosterId] = self.jerseyNumbers[fromRosterId];
                    self.positionIds[toRosterId] = (self.positionIds[fromRosterId] && angular.isArray(self.positionIds[fromRosterId])) ? self.positionIds[fromRosterId].slice() : [];
                    self.rosterStatuses[toRosterId] = true;
                }

            }
        };

        angular.augment(PlayersFactory, BaseFactory);

        return PlayersFactory;
    }
]);

