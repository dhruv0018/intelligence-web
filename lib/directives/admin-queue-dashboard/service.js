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

        'TO_BE_INDEXED': Object.assign({}, BASE_QUEUE_FILTER, {
            'status': GAME_STATUSES.READY_FOR_INDEXING.id
        }),

        'TO_BE_QAD': Object.assign({}, BASE_QUEUE_FILTER, {
            'status': GAME_STATUSES.READY_FOR_QA.id
        }),

        'INDEXING_IN_PROGRESS': Object.assign({}, BASE_QUEUE_FILTER, {
            'status': GAME_STATUSES.INDEXING.id
        }),

        'QA_IN_PROGRESS': Object.assign({}, BASE_QUEUE_FILTER, {
            'status': GAME_STATUSES.QAING.id
        }),

        'TOTAL': Object.assign({}, ALL_QUEUE_GAMES),

        '48_TO_24': Object.assign({}, ALL_QUEUE_GAMES, {
            'deadlineAfter': calculateTimestampHoursFromNow(48),
            'deadlineBefore': calculateTimestampHoursFromNow(24)
        }),

        '24_TO_10': Object.assign({}, ALL_QUEUE_GAMES, {
            'deadlineAfter': calculateTimestampHoursFromNow(24),
            'deadlineBefore': calculateTimestampHoursFromNow(10)
        }),

        '10_TO_5': Object.assign({}, ALL_QUEUE_GAMES, {
            'deadlineAfter': calculateTimestampHoursFromNow(10),
            'deadlineBefore': calculateTimestampHoursFromNow(5)
        }),

        '5_TO_2': Object.assign({}, ALL_QUEUE_GAMES, {
            'deadlineAfter': calculateTimestampHoursFromNow(5),
            'deadlineBefore': calculateTimestampHoursFromNow(2)
        }),

        'LESS_THAN_2': Object.assign({}, ALL_QUEUE_GAMES, {
            'deadlineAfter': calculateTimestampHoursFromNow(2),
            'deadlineBefore': calculateTimestampHoursFromNow(0)
        }),

        'LATE': Object.assign({}, ALL_QUEUE_GAMES, {
            'deadlineAfter': calculateTimestampHoursFromNow(0)
        }),

        'NORMAL': Object.assign({}, ALL_QUEUE_GAMES, {
            'priority': PRIORITIES.NORMAL.id
        }),

        'HIGH': Object.assign({}, ALL_QUEUE_GAMES, {
            'priority': PRIORITIES.HIGH.id
        }),

        'HIGHEST': Object.assign({}, ALL_QUEUE_GAMES, {
            'priority': PRIORITIES.HIGHEST.id
        }),

        'KL': Object.assign({}, ALL_QUEUE_GAMES, {
            'label': LABELS.KL.id
        }),

        'CB': Object.assign({}, ALL_QUEUE_GAMES, {
            'label': LABELS.CB.id
        }),

        'CC': Object.assign({}, ALL_QUEUE_GAMES, {
            'label': LABELS.CC.id
        }),

        'HT': Object.assign({}, ALL_QUEUE_GAMES, {
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

    return moment.utc().add(hours, 'hours').toISOString();
}

AdminQueueDashboardService.$inject = dependencies;

export default AdminQueueDashboardService;
