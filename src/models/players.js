var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PlayersResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'players';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST', isArray: true, url: config.api.uri + 'batch/players' },
            update: { method: 'PUT' }
        };

        return $resource(url, paramDefaults, actions);
    }
]);

