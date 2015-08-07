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

                if (!roster) throw new Error(`Missing required parameter: 'roster'`);
                if (padLength && !Number.isInteger(padLength)) throw new Error(`'padLength' should be an integer`);

                let jerseyNumber;
                let playerInfo;

                try {
                    playerInfo = roster.playerInfo;
                } catch (error) {
                    throw new Error(`'playerInfo' is not defined on roster`);
                }

                let specificPlayerInfo;

                try {
                    specificPlayerInfo = playerInfo[this.id];
                } catch (error) {
                    throw new Error(`player with id ${player.id} cannot be found on the roster given`);
                }

                jerseyNumber = specificPlayerInfo ? specificPlayerInfo.jerseyNumber : '';

                return $filter('padSpacesToFixedLength')(jerseyNumber, padLength, 'left');
            },

            /**
             * Gets a player title, a combination of a players jersey number & shortName
             * @param {roster} roster
             * @param {?number} padLength Pads the jerseyNumber with up to 3 spaces or less/more if desired
             * @returns {string} 'jerseyNumber shortName' or 'shortName' if has no jerseyNumber
             */
            getPlayerTitle: function(roster, padLength = 3) {

                if (!roster) throw new Error(`Missing required parameter: 'roster'`);
                if (padLength && !Number.isInteger(padLength)) throw new Error(`'padLength' should be an integer`);

                const jerseyNumber = this.getJerseyNumber(roster, padLength);

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
