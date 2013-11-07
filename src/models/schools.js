var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SchoolsResource', [
    'config', '$resource',
    function(config, $resource) {

        var SchoolsResource = $resource(

            config.api.uri + 'schools/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return SchoolsResource;
    }
]);

