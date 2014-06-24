var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('FiltersetsFactory', [
    'FiltersetsResource',
    function(FiltersetsResource) {
        var FiltersetsFactory = {
            resource: FiltersetsResource,
            extendFilterset: function(filterset) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "filterset" object. */
                angular.extend(filterset, self);

                return filterset;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(filterset) {

                    filterset = self.extendFilterset(filterset);

                    return success ? success(filterset) : filterset;
                };

                error = error || function() {

                    throw new Error('Could not get filterset');
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
                filter.start = filter.start || 0;
                filter.count = filter.count || 1000;

                var callback = function(filtersets) {

                    var indexedFiltersets = {};

                    filtersets.forEach(function(filterset) {

                        filterset = self.extendGame(filterset);

                        indexedFiltersets[filterset.id] = filterset;
                    });

                    filtersets = index ? indexedFiltersets : filtersets;

                    return success ? success() : games;
                };

                error = error || function() {

                    throw new Error('Could not load games list');
                };

                return self.resource.query(filter, callback, error);
            }
        };

        return FiltersetsFactory;
    }
]);
