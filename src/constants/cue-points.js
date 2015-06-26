const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const CUEPOINT_CONSTANTS = {
    TYPES: {
        'TELESTRATION': 0,
        'EVENT': 1
    },
    LABELS: [
        'TELESTRATION',
        'EVENT'
    ],
    /*
     * NOTE: The max amount of time (in seconds) before a cuePoint's time is within range of being `hit`
     * (i.e. cuepoint time = 2.2s, the cuepoint can be `hit` between 2.136s and 2.2s)
    */
    MAX_TIME_TAIL_DELTA: 0.064
};

IntelligenceWebClient.constant('CUEPOINT_CONSTANTS', CUEPOINT_CONSTANTS);
