var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlansResource', [
    'config', '$resource',
    function(config, $resource) {

        var PlansResource = $resource(

            config.api.uri + 'plans/:id',

            {

                id: '@id'

            },

            {

                create: { method: 'POST' },
                getByLeague: {
                    method: 'GET',
                    url: config.api.uri + 'plans/leagues/:leagueId',
                    params: {leagueId: '@leagueId'},
                    isArray: true
                },
                update: { method: 'PUT' }
            }
        );

        return PlansResource;
    }
]);

