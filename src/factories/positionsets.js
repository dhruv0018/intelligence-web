var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PositionsetsFactory', [
    'PositionsetsResource', '$filter',
    function(PositionsetsResource, $filter) {

        var PositionsetsFactory = {

            resource: PositionsetsResource,

            extendPositionset: function(positionset) {

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

