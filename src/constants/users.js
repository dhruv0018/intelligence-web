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
    3: 'India Office',
    4: 'Philippines Office'
};

IntelligenceWebClient.constant('INDEXER_GROUPS_ID', INDEXER_GROUPS_ID);

var EMAIL_REQUEST_TYPES = {
    FORGOTTEN_PASSWORD: 1,
    PLAYER_ACTIVATION_REMINDER: 2,
    COACH_ACTIVATION_REMINDER: 3,
    SET_ASIDE_EMAIL: 4
};

IntelligenceWebClient.constant('EMAIL_REQUEST_TYPES', EMAIL_REQUEST_TYPES);

var INDEXER_GROUPS = {
    US_MARKETPLACE: 1,
    INDIA_MARKETPLACE: 2,
    INDIA_OFFICE: 3,
    PHILIPPINES_OFFICE: 4
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
