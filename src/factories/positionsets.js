var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PositionsetsFactory', [
    'BaseFactory', '$filter',
    function(BaseFactory, $filter) {

        var PositionsetsFactory = {

            description: 'positionsets',

            model: 'PositionsetsResource',

            storage: 'PositionsetsStorage',

            extend: function(positionset) {

                var self = this;

                positionset.indexedPositions = {};
                angular.forEach(positionset.positions, function(position) {
                    positionset.indexedPositions[position.id] = position;
                });

                /* Copy all of the properties from the retrieved $resource
                 * "positionset" object. */
                angular.extend(positionset, self);

                return positionset;
            },

            getIndexedPositions: function() {

                var indexedPositions = {};

                this.positions.forEach(function(position) {

                    indexedPositions[position.id] = position;
                });

                return indexedPositions;
            },

            /**
             * Gets a position
             * @param {number} positionId
             * @returns {position}
             */
            getPosition: function(positionId) {

                if (!positionId) throw new Error(`getPosition() requires 'positionId' parameter`);
                if (typeof positionId !== 'number') throw new Error(`getPosition() 'positionId' must be of type 'number'`);

                return this.positions.find(position => positionId === position.id);
            },

            /**
             * Gets a set of positions as an array
             * @param {?number[]} positionIds
             * @returns {position[]} returns all positions if no positionIds are given
             */
            getPositions: function(positionIds) {

                if (!positionIds) return this.positions;
                if (typeof positionIds !== 'object') throw new Error(`getPositions() 'positionIds' must be of type 'array'`);

                return positionIds.map(positionId => this.getPosition(positionId));
            },

            /**
             * Gets the names from a set of positions as an array
             * @param {?number[]} positionIds
             * @returns {string} positionNames Concatenated names with commas or empty string
             */
            getPositionNames: function(positionIds) {

                let positionNames = this.getPositions(positionIds).map(position => position.name);

                return positionNames.length ? '(' + positionNames.join(', ') + ')' : '';
            },

            /**
             * Get specific player position names for a roster they are on
             * @param {roster} roster
             * @param {number} playerId
             * @returns {string} players position names separated by commas or empty string
             */
            getPlayerPositionNames: function(roster, playerId) {

                if (!roster) throw new Error(`getPlayerPositionNames() requires 'roster' parameter`);
                if (!playerId) throw new Error(`getPlayerPositionNames() requires 'playerId' parameter`);
                if (typeof playerId !== 'number') throw new Error(`getPlayerPositionNames() 'playerId' must be of type 'number'`);

                let playerInfo;

                try {
                    playerInfo = roster.playerInfo;
                } catch (error) {
                    throw new Error(`getPlayerPositionNames(): playerInfo is not defined on roster`);
                }

                let specificPlayerInfo;

                try {
                    specificPlayerInfo = playerInfo[playerId];
                } catch (error) {
                    throw new Error(`getPlayerPositionNames(): player with id ${player.id} cannot be found on the roster given`);
                }

                return this.getPositionNames(specificPlayerInfo.positionIds);
            }
        };

        angular.augment(PositionsetsFactory, BaseFactory);

        return PositionsetsFactory;
    }
]);
