var IntelligenceWebClient = require('../app');

var GAME_TYPES = [

    { name: 'Conference Game', value: 'conference', checked: true },
    { name: 'Non-Conference Game', value: 'nonconfernece', checked: false },
    { name: 'Playoff Game', value: 'playoff', checked: false },
];

IntelligenceWebClient.constant('GAME_TYPES', GAME_TYPES);

IntelligenceWebClient.factory('GamesResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'games';

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

