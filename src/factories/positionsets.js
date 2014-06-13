var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PositionsetsFactory', [
    'PositionsetsResource', 'PositionsetsStorage', 'BaseFactory', '$filter',
    function(PositionsetsResource, PositionsetsStorage, BaseFactory, $filter) {

        var PositionsetsFactory = {

            description: 'positionsets',

            storage: PositionsetsStorage,

            resource: PositionsetsResource,

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
            }
        };

        angular.augment(PositionsetsFactory, BaseFactory);

        return PositionsetsFactory;
    }
]);

