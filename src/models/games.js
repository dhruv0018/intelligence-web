var IntelligenceWebClient = require('../app');

var GAME_STATUS_IDS = {

    0: 'NONE',
    1: 'READY_FOR_INDEX',
    2: 'INDEXING',
    3: 'READY_FOR_QA',
    4: 'QAING',
    5: 'SET_ASIDE',
    6: 'INDEXED',
    7: 'NOT_INDEXED'
};

IntelligenceWebClient.constant('GAME_STATUS_IDS', GAME_STATUS_IDS);

var GAME_STATUSES = {

    NOT_INDEXED: {
        id: 0,
        name: 'Not Indexed'
    },

    READY_FOR_INDEX: {
        id: 1,
        name: 'Ready for indexing'
    },

    INDEXING: {
        id: 2,
        name: 'Indexing'
    },

    READY_FOR_QA: {
        id: 3,
        name: 'Ready for QA'
    },

    QAING: {
        id: 4,
        name: 'In QA'
    },

    SET_ASIDE: {
        id: 5,
        name: 'Set aside'
    },

    INDEXED: {
        id: 6,
        name: 'Indexed'
    }
};

IntelligenceWebClient.constant('GAME_STATUSES', GAME_STATUSES);

var GAME_TYPES = [

    { name: 'Conference Game', value: 'conference', checked: true },
    { name: 'Non-Conference Game', value: 'nonconfernece', checked: false },
    { name: 'Playoff Game', value: 'playoff', checked: false },
];

IntelligenceWebClient.constant('GAME_TYPES', GAME_TYPES);

var GAME_NOTE_TYPES = {

    COACH_NOTE: 1,
    INDEXER_NOTE: 2,
    QA_NOTE: 3,
    SET_ASIDE_NOTE: 4,
    COACH_COMPLAINT_NOTE: 5
};

IntelligenceWebClient.constant('GAME_NOTE_TYPES', GAME_NOTE_TYPES);

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

