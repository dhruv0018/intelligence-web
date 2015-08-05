var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersFactory', [
    '$injector', '$q', 'BaseFactory', '$filter',
    function($injector, $q, BaseFactory, $filter) {

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

                Object.defineProperty(player, 'name', {
                    get: function() {
                        return this.firstName + ' ' + this.lastName;
                    },
                    configurable: true
                });

                Object.defineProperty(player, 'shortName', {
                    get: function() {
                        return this.firstName[0] + '. ' + this.lastName;
                    },
                    configurable: true
                });

                return player;
            },

            /**
             * Gets a player's jersey number on a specific roster
             * @param {roster} roster
             * @param {number} padLength The length the jerseyNumber should be padded with spaces. Default is 3.
             * @returns {string} jersey number or empty string if does not exist
             */
            getJerseyNumber: function(roster, padLength = 3) {

                if (!roster) throw new Error(`getJerseyNumber() requires 'roster' parameter`);

                try {

                    let jerseyNumber = roster.playerInfo[this.id].jerseyNumber;
                    return $filter('padSpacesToFixedLength')(jerseyNumber, padLength, 'left');

                } catch (error) {

                    return '';
                }
            },

            /**
             * Gets a player label, a combination of a players jersey number, name, and other attributes
             * @param {roster} roster
             * @param {boolean} padding Pads the jerseyNumber with up to 3 spaces or less if desired
             * @returns {string} the player label
             */
            getPlayerLabel: function(roster, padding = 3) {

                if (!roster) throw new Error(`getPlayerLabel() requires 'roster' parameter`);

                const jerseyNumber = this.getJerseyNumber(roster, padding);

                return jerseyNumber ? `${jerseyNumber} ${this.shortName}` : this.shortName;
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

            },

            generateStats: function(query) {

                let self = this;

                query.id = query.id || self.id;

                const model = $injector.get(self.model);

                return model.generateStats(query).$promise;
            }
        };

        angular.augment(PlayersFactory, BaseFactory);

        return PlayersFactory;
    }
]);
