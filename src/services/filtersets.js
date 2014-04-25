var IntelligenceWebClient = require('../app');

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
            }
        };

        return FiltersetsFactory;
    }
]);
