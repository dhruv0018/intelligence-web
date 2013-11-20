var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TeamsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'teams';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' }
        };

        return $resource(url, paramDefaults, actions);
    }
]);

