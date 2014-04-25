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
            filter: {
                method: 'POST',
                url: config.api.uri + 'plays/filter/:filterId',
                params: {
                    filterId: '@filterId'
                }
            },
            create: { method: 'POST' },
            update: { method: 'PUT' }
        };

        return $resource(url, paramDefaults, actions);
    }
]);

var PLAY_FILTER_CATEGORIES = {
    1: {
        id: 1,
        name: 'Players'
    },
    2: {
        id: 2,
        name: 'Offensive Plays'
    },
    3: {
        id: 3,
        name: 'Defensive Plays'
    },
    4: {
        id: 4,
        name: 'Serves'
    },
    5: {
        id: 5,
        name: 'Receptions'
    },
    6: {
        id: 6,
        name: 'Errors'
    },
    7: {
        id: 7,
        name: 'Time Period'
    },
    8: {
        id: 8,
        name: 'Rotation'
    },
    9: {
        id: 9,
        name: 'Top Searches'
    }

};

IntelligenceWebClient.constant('PLAY_FILTER_CATEGORIES', PLAY_FILTER_CATEGORIES);
