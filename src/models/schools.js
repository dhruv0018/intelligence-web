var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('Schools', [
    '$resource',
    function($resource) {

        var Schools = $resource(

            'https://www-dev.krossover.com/intelligence-api/v1/schools/:id', {

            id: '@id'

        });

        return Schools;
    }
]);

