var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('LeaguesResource', [
    'config', '$resource',
    function(config, $resource) {

        var LeaguesResource = $resource(

            config.api.uri + 'leagues/:id',

            {
                id: '@id'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return LeaguesResource;
    }
]);

