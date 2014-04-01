var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PositionsetsFactory', [
    'PositionsetsResource', '$filter',
    function(PositionsetsResource, $filter) {

        var PositionsetsFactory = {

            resource: PositionsetsResource,

            extendPositionset: function(positionset) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "positionset" object. */
                angular.extend(positionset, self);

                return positionset;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(positionset) {

                    positionset = self.extendPositionset(positionset);

                    return success ? success(positionset) : positionset;
                };

                error = error || function() {

                    throw new Error('Could not get positionset');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};

                var callback = function(positionsets) {

                    var indexedPositionsets = {};

                    positionsets.forEach(function(positionset) {

                        positionset = self.extendPositionset(positionset);

                        indexedPositionsets[positionset.id] = positionset;
                    });

                    positionsets = index ? indexedPositionsets : positionsets;

                    return success ? success(positionsets) : positionsets;
                };

                error = error || function() {

                    throw new Error('Could not load positionsets');
                };

                return self.resource.query(filter, callback, error);
            },

            getIndexedPositions: function() {

                var indexedPositions = {};

                this.positions.forEach(function(position) {

                    indexedPositions[position.id] = position;
                });

                return indexedPositions;
            }
        };

        return PositionsetsFactory;
    }
]);

