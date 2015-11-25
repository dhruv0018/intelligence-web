import {GAME_STATUSES} from './games.js';
import {VIDEO_STATUSES} from './videos.js';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const VIEWS = {
    QUEUE: {
        GAME: {
            QUERY_SIZE: 100,
            ALL: {
                'status[]': [
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id
                ],
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                sortBy: 'deadline',
                sortOrder: 'asc',
                isDeleted: false
            },
            PRIORITY_1: {
                'status[]': [
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id
                ],
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                priority: 1,
                sortBy: 'deadline',
                sortOrder: 'asc'
            },
            PRIORITY_2: {
                'status[]': [
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id
                ],
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                priority: 2,
                sortBy: 'deadline',
                sortOrder: 'asc'
            },
            PRIORITY_3: {
                'status[]': [
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id
                ],
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                priority: 3,
                sortBy: 'deadline',
                sortOrder: 'asc'
            },
            READY_FOR_QA_PRIORITY_1: {
                status: GAME_STATUSES.READY_FOR_QA.id,
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                priority: 1,
                sortBy: 'deadline',
                sortOrder: 'asc'
            },
            READY_FOR_QA_PRIORITY_2: {
                status: GAME_STATUSES.READY_FOR_QA.id,
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                priority: 2,
                sortBy: 'deadline',
                sortOrder: 'asc'
            },
            READY_FOR_QA_PRIORITY_3: {
                status: GAME_STATUSES.READY_FOR_QA.id,
                videoStatus: VIDEO_STATUSES.COMPLETE.id,
                priority: 3,
                sortBy: 'deadline',
                sortOrder: 'asc'
            }
        },
        USERS: {
            'relatedGameStatus[]': [
                GAME_STATUSES.READY_FOR_INDEXING.id,
                GAME_STATUSES.INDEXING.id,
                GAME_STATUSES.READY_FOR_QA.id,
                GAME_STATUSES.QAING.id,
                GAME_STATUSES.SET_ASIDE.id
            ],
        },
        TEAMS: {
            'relatedGameStatus[]': [
                GAME_STATUSES.READY_FOR_INDEXING.id,
                GAME_STATUSES.INDEXING.id,
                GAME_STATUSES.READY_FOR_QA.id,
                GAME_STATUSES.QAING.id,
                GAME_STATUSES.SET_ASIDE.id
            ],
        },
    }
};

IntelligenceWebClient.constant('VIEWS', VIEWS);
export {VIEWS};
