var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TeamsResource', [
    '$resource',
    function($resource) {

        var TeamsResource = $resource(

            'https://www-dev.krossover.com/intelligence-api/v1/teams/:id',
            {
                id: '@id'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return TeamsResource;
    }
]);

