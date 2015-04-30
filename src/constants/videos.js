const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const VIDEO_STATUS_IDS = {

    1: 'INCOMPLETE',
    2: 'UPLOADED',
    4: 'COMPLETE',
    8: 'FAILED'
};

IntelligenceWebClient.constant('VIDEO_STATUS_IDS', VIDEO_STATUS_IDS);

const VIDEO_STATUSES = {

    INCOMPLETE: {
        id: 1,
        name: 'Incomplete'
    },

    UPLOADED: {
        id: 2,
        name: 'Uploaded'
    },

    COMPLETE: {
        id: 4,
        name: 'Complete'
    },

    FAILED: {
        id: 8,
        name: 'Failed'
    }
};

IntelligenceWebClient.constant('VIDEO_STATUSES', VIDEO_STATUSES);

const SEEKING_STATES = {

    NOT_SEEKING: 0,
    FAST_BACKWARD: 1,
    SLOW_BACKWARD: 2,
    SLOW_FORWARD: 3,
    FAST_FORWARD: 4
};

IntelligenceWebClient.constant('SEEKING_STATES', SEEKING_STATES);

const RESUME_STATES = {

    DEFAULT: 0,
    RESUME: 1,
    PAUSE: 2
};

IntelligenceWebClient.constant('RESUME_STATES', RESUME_STATES);

export {VIDEO_STATUS_IDS, VIDEO_STATUSES, SEEKING_STATES, RESUME_STATES};
