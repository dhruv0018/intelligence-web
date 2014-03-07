var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PlaysResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'plays';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            query: {
                method: 'GET',
                url: config.api.uri + 'games/:gameId/plays',
                params: { gameId: '@gameId' },
                isArray: true
            },
            create: { method: 'POST' },
            update: { method: 'PUT' }
        };

        return $resource(url, paramDefaults, actions);
    }
]);