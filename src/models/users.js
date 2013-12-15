var IntelligenceWebClient = require('../app');

var ROLE_ID = {

    1: 'SUPER_ADMIN',
    2: 'ADMIN',
    3: 'HEAD_COACH',
    4: 'ASSISTANT_COACH',
    5: 'INDEXER',
    6: 'PARENT',
    7: 'ATHLETE'
};

IntelligenceWebClient.constant('ROLE_ID', ROLE_ID);

var ROLE_TYPE = {

    SUPER_ADMIN: 1,
    ADMIN: 2,
    HEAD_COACH: 3,
    ASSISTANT_COACH: 4,
    INDEXER: 5,
    PARENT: 6,
    ATHLETE: 7
};

IntelligenceWebClient.constant('ROLE_TYPE', ROLE_TYPE);

var ROLES = {

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

IntelligenceWebClient.constant('ROLES', ROLES);

IntelligenceWebClient.factory('UsersResource', [
    'config', '$resource',
    function(config, $resource) {

        var UsersResource = $resource(

            config.api.uri + 'users/:id',

            {
                id: '@id'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return UsersResource;
    }
]);

