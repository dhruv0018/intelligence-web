const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const VIDEO_PLAYER_EVENTS = {
    'ON_TIME_UPDATE': 0,
    'ON_CAN_PLAY': 1,
    'ON_PLAY': 2,
    'ON_SEEKING': 3,
    'ON_PAUSE': 4,
    'ON_CLIP_COMPLETE': 5,
    'PLAY': 6,
    'FULLSCREEN': 7
};

IntelligenceWebClient.constant('VIDEO_PLAYER_EVENTS', VIDEO_PLAYER_EVENTS);
