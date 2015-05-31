const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const TRANSCODE_PROFILE_IDS = {

    1: '360p',
    2: '480p',
    3: '720p'
};

IntelligenceWebClient.constant('TRANSCODE_PROFILE_IDS', TRANSCODE_PROFILE_IDS);

const TRANSCODE_PROFILES = {

    '360p': {
        id: 1,
        targetBitrate: 600,
        maximumBitrate: 800,
        minimumBitrate: 0,
        description: 'SD Low Resolution (360p)',
        targetDisplayWidth: 640,
        targetDisplayHeight: 360,
        aspectRatio: '16:9',
        title: '360p'
    },

    '480p': {
        id: 2,
        targetBitrate: 1600,
        maximumBitrate: 1900,
        minimumBitrate: 1000,
        description: 'SD High Resolution (480p)',
        targetDisplayWidth: 848,
        targetDisplayHeight: 480,
        aspectRatio: '16:9',
        title: '480p'
    },

    '720p': {
        id: 3,
        targetBitrate: 3500,
        maximumBitrate: 5000,
        minimumBitrate: 2400,
        description: 'HD Resolution (720)',
        targetDisplayWidth: 1280,
        targetDisplayHeight: 720,
        aspectRatio: '16:9',
        title: '720p'
    }
};

IntelligenceWebClient.constant('TRANSCODE_PROFILES', TRANSCODE_PROFILES);

export { TRANSCODE_PROFILE_IDS, TRANSCODE_PROFILES };
