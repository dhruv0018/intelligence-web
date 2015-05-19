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
     * NOTE: The max amount of time (in seconds) that a CUEPOINT can be different from the current time
     * to be 'triggered' before it is no longer within this specified range. (i.e. cuepoint time = 2.2s,
     * the cuepoint can be triggered if the current time is between 2.0s and 2.4s).
    */
    MAX_TIME_DELTA: 0.2
};

IntelligenceWebClient.constant('CUEPOINT_CONSTANTS', CUEPOINT_CONSTANTS);
