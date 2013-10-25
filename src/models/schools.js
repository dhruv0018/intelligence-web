var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SchoolsResource', [
    '$resource',
    function($resource) {

        var SchoolsResource = $resource(

            'https://www-dev.krossover.com/intelligence-api/v1/schools/:id', {

                id: '@id'

            }, {

                create: { method: 'POST' },
                update: { method: 'PUT' }
            }
        );

        return SchoolsResource;
    }
]);

