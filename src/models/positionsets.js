var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PositionsetsResource', [
    'config', '$resource',
    function(config, $resource) {

        var PositionsetsResource = $resource(

            config.api.uri + 'position-sets/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return PositionsetsResource;
    }
]);

