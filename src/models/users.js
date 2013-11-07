var IntelligenceWebClient = require('../app');

var ROLE_TYPE = {

    SUPER_ADMIN: 1,
    ADMIN: 2,
    COACH: 3,
    ASSISTANT_COACH: 4,
    INDEXER: 5,
    PARENT: 6,
    ATHLETE: 7
};

IntelligenceWebClient.constant('ROLE_TYPE', ROLE_TYPE);

var ROLES = [

    {
        type: {

            id: ROLE_TYPE.SUPER_ADMIN,
            name: 'Super Admin'
        }
    },

    {
        type: {

            id: ROLE_TYPE.ADMIN,
            name: 'Admin'
        }
    },

    {
        type: {

            id: ROLE_TYPE.COACH,
            name: 'Coach'
        }
    },

    {
        type: {

            id: ROLE_TYPE.ASSISTANT_COACH,
            name: 'Assistant Coach'
        }
    },

    {
        type: {

            id: ROLE_TYPE.INDEXER,
            name: 'Indexer'
        }
    },

    {
        type: {

            id: ROLE_TYPE.PARENT,
            name: 'Parent'
        }
    },

    {
        type: {

            id: ROLE_TYPE.ATHLETE,
            name: 'Athlete'
        }
    }
];

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

