var IntelligenceWebClient = require('../app');

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

    INDEXER: {

        type: {

            id: ROLE_TYPE.INDEXER,
            name: 'Indexer'
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
    '$resource',
    function($resource) {

        var UsersResource = $resource(

            'https://www-dev.krossover.com/intelligence-api/v1/users/:id',
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

