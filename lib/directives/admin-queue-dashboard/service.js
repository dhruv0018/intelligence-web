const moment = require('moment');

const dependencies = [
    'AdminGamesService',
    'AdminGamesEventEmitter',
    'EVENT',
    'PRIORITIES',
    'LABELS',
    'VIDEO_STATUSES',
    'GAME_STATUSES'
];

function AdminQueueDashboardService(
    AdminGamesService,
    AdminGamesEventEmitter,
    EVENT,
    PRIORITIES,
    LABELS,
    VIDEO_STATUSES,
    GAME_STATUSES
){

    const BASE_QUEUE_FILTER = {

        'start': 0,
        'sortBy': 'deadline',
        'sortOrder': 'asc',
        'videoStatus': VIDEO_STATUSES.COMPLETE.id,
        'isDeleted': false
    };

    const ALL_QUEUE_GAMES = Object.assign({}, BASE_QUEUE_FILTER, {

        'status[]': [
            GAME_STATUSES.READY_FOR_INDEXING.id,
            GAME_STATUSES.READY_FOR_QA.id,
            GAME_STATUSES.INDEXING.id,
            GAME_STATUSES.QAING.id
        ]
    });

    const FILTERS = {

        'TO_BE_INDEXED': {
            id: 0,
            query: Object.assign({}, BASE_QUEUE_FILTER, {
                'status': GAME_STATUSES.READY_FOR_INDEXING.id
            }),
        },

        'TO_BE_QAD': {
            id: 1,
            query: Object.assign({}, BASE_QUEUE_FILTER, {
                'status': GAME_STATUSES.READY_FOR_QA.id
            }),
        },

        'INDEXING_IN_PROGRESS': {
            id: 2,
            query: Object.assign({}, BASE_QUEUE_FILTER, {
                'status': GAME_STATUSES.INDEXING.id
            }),
        },

        'QA_IN_PROGRESS': {
            id: 3,
            query: Object.assign({}, BASE_QUEUE_FILTER, {
                'status': GAME_STATUSES.QAING.id
            }),
        },

        'TOTAL': {
            id: 4,
            query: Object.assign({}, ALL_QUEUE_GAMES),
        },

        '48_TO_24': {
            id: 5,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'deadlineBefore': calculateTimestampHoursFromNow(48),
                'deadlineAfter': calculateTimestampHoursFromNow(24)
            }),
        },

        '24_TO_10': {
            id: 6,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'deadlineBefore': calculateTimestampHoursFromNow(24),
                'deadlineAfter': calculateTimestampHoursFromNow(10)
            }),
        },

        '10_TO_5': {
            id: 7,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'deadlineBefore': calculateTimestampHoursFromNow(10),
                'deadlineAfter': calculateTimestampHoursFromNow(5)
            }),
        },

        '5_TO_2': {
            id: 8,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'deadlineBefore': calculateTimestampHoursFromNow(5),
                'deadlineAfter': calculateTimestampHoursFromNow(2)
            }),
        },

        'LESS_THAN_2': {
            id: 9,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'deadlineBefore': calculateTimestampHoursFromNow(2),
                'deadlineAfter': calculateTimestampHoursFromNow(0)
            }),
        },

        'LATE': {
            id: 10,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'deadlineBefore': calculateTimestampHoursFromNow(0)
            }),
        },

        'NORMAL': {
            id: 11,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'priority': PRIORITIES.NORMAL.id
            }),
        },

        'HIGH': {
            id: 12,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'priority': PRIORITIES.HIGH.id
            }),
        },

        'HIGHEST': {
            id: 13,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'priority': PRIORITIES.HIGHEST.id
            }),
        },

        'KL': {
            id: 14,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'label': LABELS.KL.id
            }),
        },

        'CB': {
            id: 15,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'label': LABELS.CB.id
            }),
        },

        'CC': {
            id: 16,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'label': LABELS.CC.id
            }),
        },

        'HT': {
            id: 17,
            query: Object.assign({}, ALL_QUEUE_GAMES, {
                'label': LABELS.HT.id
            })
        }
    };

    const requestQueueFilter = FILTER => {

        AdminGamesService.queryFilter = FILTERS[FILTER].query;
        AdminGamesService.query();
    };

    return {
        requestQueueFilter,
        FILTERS
    };
}

function calculateTimestampHoursFromNow(hours = 0) {

    return moment.utc().add(hours, 'hours').toISOString();
}

AdminQueueDashboardService.$inject = dependencies;

export default AdminQueueDashboardService;
