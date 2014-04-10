var IntelligenceWebClient = require('../app');

var GAME_STATUS_IDS = {

    0: 'NOT_INDEXED',
    1: 'READY_FOR_INDEXING',
    2: 'INDEXING',
    3: 'READY_FOR_QA',
    4: 'QAING',
    5: 'SET_ASIDE',
    6: 'INDEXED'
};

IntelligenceWebClient.constant('GAME_STATUS_IDS', GAME_STATUS_IDS);

var GAME_STATUSES = {

    NOT_INDEXED: {
        id: 0,
        type: 'warning',
        name: 'Not Indexed'
    },

    READY_FOR_INDEXING: {
        id: 1,
        type: 'success',
        name: 'Indexing, not started'
    },

    INDEXING: {
        id: 2,
        type: 'warning',
        name: 'Indexing, in progress'
    },

    READY_FOR_QA: {
        id: 3,
        type: 'success',
        name: 'QA, not started'
    },

    QAING: {
        id: 4,
        type: 'warning',
        name: 'QA, in progress'
    },

    SET_ASIDE: {
        id: 5,
        type: 'warning',
        name: 'Set aside'
    },

    INDEXED: {
        id: 6,
        type: 'success',
        name: 'Game Status: Delivered'
    },

    /* TODO: This needs to be worked out still,
     * added as a placeholder for no, to not forget. */
    DELETED: {
        id: 7,
        type: 'danger',
        name: 'Deleted'
    }
};

IntelligenceWebClient.constant('GAME_STATUSES', GAME_STATUSES);

var GAME_TYPE_IDS = {

    'conference': 'CONFERENCE',
    'nonconference': 'NON_CONFERENCE',
    'playoff': 'PLAYOFF'
};

IntelligenceWebClient.constant('GAME_TYPES_IDS', GAME_TYPES_IDS);

var GAME_TYPES = [

    CONFERENCE: {

        id: 'conference',
        name: 'Conference Game'
    },

    NON_CONFERENCE: {

        id: 'nonconference',
        name: 'Non-Conference Game'
    },

    PLAYOFF: {

        id: 'playoff',
        name: 'Playoff'
    }
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

