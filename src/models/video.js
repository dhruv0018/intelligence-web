var IntelligenceWebClient = require('../app');

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

