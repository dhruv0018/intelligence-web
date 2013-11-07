var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TeamsResource', [
    'config', '$resource',
    function(config, $resource) {

        var TeamsResource = $resource(

            config.api.uri + 'teams/:id',

            {
                id: '@id'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return TeamsResource;
    }
]);

