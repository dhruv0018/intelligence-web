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

/**
 * @constant
 * Specifies the current seeking state for the video player.
 * @type {Number}
*/

const SEEKING_STATES = {

    NOT_SEEKING: 0,
    FAST_BACKWARD: 1,
    SLOW_BACKWARD: 2,
    SLOW_FORWARD: 3,
    FAST_FORWARD: 4
};

IntelligenceWebClient.constant('SEEKING_STATES', SEEKING_STATES);

/**
 * @constant
 * Used to determine the video player's play/pause state after a seeking
 * function is complete. For instance, if the video was playing and user
 * initiated backward seeking, on seeking complete, the player should resume
 * playback: PLAYBACK_RESUME_STATES.RESUME === 1.
 * @type {Number}
*/

const PLAYBACK_RESUME_STATES = {

    /** Do nothing if seeking state changes from outside (videogular play/pause)  */
    DEFAULT: 0,
    /** Set the player to play after seeking complete */
    RESUME: 1,
    /** Set the player to pause after seeking complete */
    PAUSE: 2
};

IntelligenceWebClient.constant('PLAYBACK_RESUME_STATES', PLAYBACK_RESUME_STATES);

const VIDEO_PLAYER_CONFIG = {

    // min height for parent of video player to be used for determining videos height
    MIN_PARENT_HEIGHT: 50,

    ASPECT_RATIO: 16 / 9,

    //Not loaded at this point, so need to hardcode
    CONTROLS_HEIGHT: 60
};

IntelligenceWebClient.constant('VIDEO_PLAYER_CONFIG', VIDEO_PLAYER_CONFIG);

export {VIDEO_STATUS_IDS, VIDEO_STATUSES, PLAYBACK_RESUME_STATES, VIDEO_PLAYER_CONFIG, TRANSCODE_PROFILES_IDS, TRANSCODE_PROFILES};
