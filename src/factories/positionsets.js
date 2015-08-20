const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PositionsetsFactory', [
    'BaseFactory', '$filter',
    function(BaseFactory, $filter) {

        const PositionsetsFactory = {

            description: 'positionsets',

            model: 'PositionsetsResource',

            storage: 'PositionsetsStorage',

            extend: function(positionset) {

                let self = this;

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

                let indexedPositions = {};

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

                if (!positionId) throw new Error(`Missing required parameter: 'positionId'`);
                if (!Number.isInteger(positionId)) throw new Error(`'positionId' must be an integer`);

                return this.positions.find(position => positionId === position.id);
            },

            /**
             * Gets a set of positions as an array
             * @param {?number[]} positionIds
             * @returns {position[]} returns all positions if no positionIds are given
             */
            getPositions: function(positionIds) {

                if (!positionIds) return this.positions;
                if (!Array.isArray(positionIds)) throw new Error(`'positionIds' must be an array`);

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

                if (!roster) throw new Error(`Missing required parameter: 'roster'`);
                if (!playerId) throw new Error(`Missing required parameter: 'playerId'`);
                if (!Number.isInteger(playerId)) throw new Error(`'playerId' must be an integer`);

                let playerInfo;

                try {
                    playerInfo = roster.playerInfo;
                } catch (error) {
                    throw new Error(`'playerInfo' is not defined on roster`);
                }

                let specificPlayerInfo;

                try {
                    specificPlayerInfo = playerInfo[playerId];
                } catch (error) {
                    throw new Error(`player with id ${player.id} cannot be found on the roster given`);
                }

                return this.getPositionNames(specificPlayerInfo.positionIds);
            }
        };

        angular.augment(PositionsetsFactory, BaseFactory);

        return PositionsetsFactory;
    }
]);
