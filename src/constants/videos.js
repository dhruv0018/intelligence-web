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

const TRANSCODE_PROFILES_IDS = {

    1: 'SD_LOW',
    2: 'SD_HIGH',
    3: 'HD'
};

IntelligenceWebClient.constant('TRANSCODE_PROFILES_IDS', TRANSCODE_PROFILES_IDS);

const TRANSCODE_PROFILES = {

    SD_LOW: {
        id: 1,
        name: 'SD Low Resolution',
        quality: '360p',
        targetBitrate: 600
    },

    SD_HIGH: {
        id: 2,
        name: 'SD High Resolution',
        quality: '480p',
        targetBitrate: 1600
    },

    HD: {
        id: 3,
        name: 'HD Resolution',
        quality: '720p',
        targetBitrate: 3500
    }
};

IntelligenceWebClient.constant('TRANSCODE_PROFILES', TRANSCODE_PROFILES);

export {VIDEO_STATUS_IDS, VIDEO_STATUSES};
