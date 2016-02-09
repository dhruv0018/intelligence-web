var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var ROLE_ID = {

    0: 'ANONYMOUS',
    1: 'SUPER_ADMIN',
    2: 'ADMIN',
    9: 'COACH',
    3: 'HEAD_COACH',
    4: 'ASSISTANT_COACH',
    5: 'INDEXER',
    6: 'PARENT',
    7: 'ATHLETE'
};

IntelligenceWebClient.constant('ROLE_ID', ROLE_ID);

var ROLE_TYPE = {

    ANONYMOUS: 0,
    SUPER_ADMIN: 1,
    ADMIN: 2,
    COACH: 9,
    HEAD_COACH: 3,
    ASSISTANT_COACH: 4,
    INDEXER: 5,
    PARENT: 6,
    ATHLETE: 7
};

IntelligenceWebClient.constant('ROLE_TYPE', ROLE_TYPE);

var ROLES = {

    ANONYMOUS: {

        type: {

            id: ROLE_TYPE.ANONYMOUS,
            name: 'Anonymous'
        }
    },

    SUPER_ADMIN: {

        type: {

            id: ROLE_TYPE.SUPER_ADMIN,
            name: 'Super Admin'
        }
    },

    ADMIN: {

        type: {

            id: ROLE_TYPE.ADMIN,
            name: 'Admin'
        }
    },

    INDEXER: {

        type: {

            id: ROLE_TYPE.INDEXER,
            name: 'Indexer'
        }
    },

    COACH: {

        type: {

            id: [ROLE_TYPE.HEAD_COACH, ROLE_TYPE.ASSISTANT_COACH],
            name: 'Coach'
        }
    },

    HEAD_COACH: {

        type: {

            id: ROLE_TYPE.HEAD_COACH,
            name: 'Head Coach'
        }
    },

    ASSISTANT_COACH: {

        type: {

            id: ROLE_TYPE.ASSISTANT_COACH,
            name: 'Assistant Coach'
        }
    },

    PARENT: {

        type: {

            id: ROLE_TYPE.PARENT,
            name: 'Parent'
        }
    },

    ATHLETE: {

        type: {

            id: ROLE_TYPE.ATHLETE,
            name: 'Athlete'
        }
    }
};

var INDEXER_GROUPS_ID = {
    1: 'US Marketplace',
    2: 'India Marketplace',
    3: 'India Sandcube',
    4: 'India SourceUs',
    5: 'India Relativit',
    6: 'India Tacklesoft',
    7: 'India Highwave',
    8: 'Cambodia WBO',
    9: 'Philippines Marketplace',
    10: 'Philippines Chrisian',
    11: 'Office 1',
    12: 'Office 2',
    13: 'Office 3'
};

IntelligenceWebClient.constant('INDEXER_GROUPS_ID', INDEXER_GROUPS_ID);

var EMAIL_REQUEST_TYPES = {
    FORGOTTEN_PASSWORD: 1,
    PLAYER_ACTIVATION_REMINDER: 2,
    COACH_ACTIVATION_REMINDER: 3,
    SET_ASIDE_EMAIL: 4,
    NEW_USER: 5,
    REVERT_TO_INDEXING: 6
};

IntelligenceWebClient.constant('EMAIL_REQUEST_TYPES', EMAIL_REQUEST_TYPES);

var INDEXER_GROUPS = {
    US_MARKETPLACE: 1,
    INDIA_MARKETPLACE: 2,
    INDIA_SANDCUBE: 3,
    INDIA_SOURCEUS: 4,
    INDIA_RELATIVIT: 5,
    INDIA_TACKLESOFT: 6,
    INDIA_HIGHWAVE: 7,
    CAMBODIA_WBO: 8,
    PHILIPPINES_MARKETPLACE: 9,
    PHILIPPINES_CHRISIAN: 10,
    OFFICE_1: 11,
    OFFICE_2: 12,
    OFFICE_3: 13
};

IntelligenceWebClient.constant('INDEXER_GROUPS', INDEXER_GROUPS);

IntelligenceWebClient.constant('ROLES', ROLES);

IntelligenceWebClient.factory('ANONYMOUS_USER', [
    'UsersFactory',
    function run(users) {

        var ANONYMOUS_USER = users.create({

            id: 0,
            roles: [{
                type: ROLE_TYPE.ANONYMOUS
            }]
        });

        return ANONYMOUS_USER;
    }
]);

var ATHLETE_DOMINANT_HAND_TYPES_ID = {
    1: 'RIGHT_HAND',
    2: 'LEFT_HAND',
    3: 'AMBIDEXTROUS'
};

IntelligenceWebClient.constant('ATHLETE_DOMINANT_HAND_TYPES_ID', ATHLETE_DOMINANT_HAND_TYPES_ID);

var ATHLETE_DOMINANT_HAND_TYPES = {
    RIGHT_HAND: {
        id: 1,
        description: 'Right Hand'
    },
    LEFT_HAND: {
        id: 2,
        description: 'Left Hand'
    },
    AMBIDEXTROUS: {
        id: 3,
        description: 'Ambidextrous'
    }
};

IntelligenceWebClient.constant('ATHLETE_DOMINANT_HAND_TYPES', ATHLETE_DOMINANT_HAND_TYPES);

const ATHLETE_PROFILE_TEAM_START_YEARS = {
    EARLIEST: 1990
};

IntelligenceWebClient.constant('ATHLETE_PROFILE_TEAM_START_YEARS', ATHLETE_PROFILE_TEAM_START_YEARS);
