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
            getPositionById: function(positionId) {

                return this.positions.find(position => positionId === position.id);
            }
        };

        angular.augment(PositionsetsFactory, BaseFactory);

        return PositionsetsFactory;
    }
]);
