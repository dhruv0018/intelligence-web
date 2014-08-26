var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var VIDEO_STATUS_IDS = {

    1: 'INCOMPLETE',
    2: 'UPLOADED',
    4: 'COMPLETE',
    8: 'FAILED'
};

IntelligenceWebClient.constant('VIDEO_STATUS_IDS', VIDEO_STATUS_IDS);

var VIDEO_STATUSES = {

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

