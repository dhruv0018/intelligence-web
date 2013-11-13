var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SportsResource', [
    'config', '$resource',
    function(config, $resource) {

        var SportsResource = $resource(

            config.api.uri + 'sports/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return SportsResource;
    }
]);

