var IntelligenceWebClient = require('../app');

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

