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

                return this.positions.find(position => positionId === position.id);
            },

            /**
             * Gets a set of positions as an array
             * @param {number} positionIds
             * @returns {position[]}
             */
            getPositions: function(positionIds) {

                if (!positionIds) return this.positions;

                return positionIds.map(positionId => this.getPosition(positionId));
            },

            /**
             * Gets the names from a set of positions as an array
             * @param {number} positionIds
             * @returns {positionName[]}
             */
            getPositionNames: function(positionIds) {

                return this.getPositions(positionIds).map(position => position.name);
            }
        };

        angular.augment(PositionsetsFactory, BaseFactory);

        return PositionsetsFactory;
    }
]);
