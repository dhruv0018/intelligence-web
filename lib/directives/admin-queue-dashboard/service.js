const moment = require('moment');

const dependencies = [
    'AdminGamesService',
    'AdminGamesEventEmitter',
    'EVENT',
    'PRIORITIES',
    'LABELS',
    'GAME_STATUSES'
];

function AdminQueueDashboardService(
    AdminGamesService,
    AdminGamesEventEmitter,
    EVENT,
    PRIORITIES,
    LABELS,
    GAME_STATUSES
){

    const QUEUE_GAME_STATUSES = {
        'status[]': [
            GAME_STATUSES.READY_FOR_INDEXING.id,
            GAME_STATUSES.READY_FOR_QA.id,
            GAME_STATUSES.INDEXING.id,
            GAME_STATUSES.QAING.id
        ]
    };

    const FILTERS = {

        'TO_BE_INDEXED': {
            'status': GAME_STATUSES.READY_FOR_INDEXING.id
        },

        'TO_BE_QAD': {
            'status': GAME_STATUSES.READY_FOR_QA.id
        },

        'INDEXING_IN_PROGRESS': {
            'status': GAME_STATUSES.INDEXING.id
        },

        'QA_IN_PROGRESS': {
            'status': GAME_STATUSES.QAING.id
        },

        'TOTAL': Object.assign({}, QUEUE_GAME_STATUSES),

        '48_TO_24': Object.assign({}, QUEUE_GAME_STATUSES, {
            'deadlineAfter': calculateTimestampHoursFromNow(48),
            'deadlineBefore': calculateTimestampHoursFromNow(24)
        }),

        '24_TO_10': Object.assign({}, QUEUE_GAME_STATUSES, {
            'deadlineAfter': calculateTimestampHoursFromNow(24),
            'deadlineBefore': calculateTimestampHoursFromNow(10)
        }),

        '10_TO_5': Object.assign({}, QUEUE_GAME_STATUSES, {
            'deadlineAfter': calculateTimestampHoursFromNow(10),
            'deadlineBefore': calculateTimestampHoursFromNow(5)
        }),

        '5_TO_2': Object.assign({}, QUEUE_GAME_STATUSES, {
            'deadlineAfter': calculateTimestampHoursFromNow(5),
            'deadlineBefore': calculateTimestampHoursFromNow(2)
        }),

        'LESS_THAN_2': Object.assign({}, QUEUE_GAME_STATUSES, {
            'deadlineAfter': calculateTimestampHoursFromNow(2),
            'deadlineBefore': calculateTimestampHoursFromNow(0)
        }),

        'LATE': Object.assign({}, QUEUE_GAME_STATUSES, {
            'deadlineAfter': calculateTimestampHoursFromNow(0)
        }),

        'NORMAL': Object.assign({}, QUEUE_GAME_STATUSES, {
            'priority': PRIORITIES.NORMAL.id
        }),

        'HIGH': Object.assign({}, QUEUE_GAME_STATUSES, {
            'priority': PRIORITIES.HIGH.id
        }),

        'HIGHEST': Object.assign({}, QUEUE_GAME_STATUSES, {
            'priority': PRIORITIES.HIGHEST.id
        }),

        'KL': Object.assign({}, QUEUE_GAME_STATUSES, {
            'label': LABELS.KL.id
        }),

        'CB': Object.assign({}, QUEUE_GAME_STATUSES, {
            'label': LABELS.CB.id
        }),

        'CC': Object.assign({}, QUEUE_GAME_STATUSES, {
            'label': LABELS.CC.id
        }),

        'HT': Object.assign({}, QUEUE_GAME_STATUSES, {
            'label': LABELS.HT.id
        })
    };

    const requestQueueFilter = (FILTER) => {

        AdminGamesService.queryFilter = FILTERS[FILTER];
        AdminGamesService.query().then(() => AdminGamesEventEmitter.emit(
            EVENT.ADMIN.GAME_COUNT.UPDATE,
            AdminGamesService.queryFilter
        ));
    };

    return {
        requestQueueFilter
    };
}

function calculateTimestampHoursFromNow(hours = 0) {

    return moment.utc().add(hours, 'hours');
}

AdminQueueDashboardService.$inject = dependencies;

export default AdminQueueDashboardService;
