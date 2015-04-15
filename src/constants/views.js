import {GAME_STATUSES} from './games.js';
import {VIDEO_STATUSES} from './videos.js';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const VIEWS = {
    QUEUE: {
        GAME: {
            'status[]': [
                GAME_STATUSES.READY_FOR_INDEXING.id,
                GAME_STATUSES.INDEXING.id,
                GAME_STATUSES.READY_FOR_QA.id,
                GAME_STATUSES.QAING.id,
                GAME_STATUSES.SET_ASIDE.id
            ],
            videoStatus: VIDEO_STATUSES.COMPLETE.id
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
