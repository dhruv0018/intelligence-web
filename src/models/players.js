var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('PlayersResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'batch/players';

        var url = config.api.uri + base;

        var paramDefaults = {

        };

        var actions = {

            create: { method: 'POST', isArray: true }
        };

        return $resource(url, paramDefaults, actions);
    }
]);

