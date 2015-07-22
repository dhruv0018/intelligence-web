const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const GAME_STATUS_IDS = {

    0: 'NOT_INDEXED',
    1: 'SUBMITTED_FOR_INDEXING',
    2: 'INDEXING',
    3: 'READY_FOR_QA',
    4: 'QAING',
    5: 'SET_ASIDE',
    6: 'INDEXED',
    7: 'FINALIZED',
    8: 'READY_FOR_INDEXING'
};

IntelligenceWebClient.constant('GAME_STATUS_IDS', GAME_STATUS_IDS);

const GAME_STATUSES = {

    NOT_INDEXED: {
        id: 0,
        type: 'warning',
        name: 'Not Indexed'
    },

    SUBMITTED_FOR_INDEXING: {
        id: 1,
        type: 'success',
        name: 'Indexing, submitted'
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
        name: 'Prepping Game for Delivery'
    },

    FINALIZED: {
        id: 7,
        type: 'success',
        name: 'Game Delivered'
    },

    READY_FOR_INDEXING: {
        id: 8,
        type: 'success',
        name: 'Indexing, not started'
    }
};

IntelligenceWebClient.constant('GAME_STATUSES', GAME_STATUSES);

const GAME_TYPES_IDS = {

    1: 'CONFERENCE',
    2: 'NON_CONFERENCE',
    3: 'PLAYOFF',
    4: 'SCOUTING',
    5: 'SCRIMMAGE'
};

IntelligenceWebClient.constant('GAME_TYPES_IDS', GAME_TYPES_IDS);

const GAME_TYPES = {

    CONFERENCE: {

        id: 1,
        name: 'Conference Game',
        filterType: 'regular',
        type: 'regular'
    },

    NON_CONFERENCE: {

        id: 2,
        name: 'Non-Conference Game',
        filterType: 'regular',
        type: 'regular'
    },

    PLAYOFF: {

        id: 3,
        name: 'Playoff',
        filterType: 'regular',
        type: 'regular'
    },

    SCOUTING: {

        id: 4,
        name: 'Scouting',
        filterType: 'scouting',
        type: 'non-regular'
    },

    SCRIMMAGE: {

        id: 5,
        name: 'Scrimmage',
        filterType: 'scrimmage',
        type: 'non-regular'
    }
};

IntelligenceWebClient.constant('GAME_TYPES', GAME_TYPES);

const GAME_NOTE_TYPES = {

    COACH_NOTE: 1,
    INDEXER_NOTE: 2,
    QA_NOTE: 3,
    SET_ASIDE_NOTE: 4,
    COACH_FEEDBACK_NOTE: 5
};

IntelligenceWebClient.constant('GAME_NOTE_TYPES', GAME_NOTE_TYPES);
export {GAME_STATUS_IDS, GAME_STATUSES,GAME_TYPES_IDS, GAME_TYPES, GAME_NOTE_TYPES};
