var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('GamesResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'games';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id',
        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },

            query: {
                method: 'GET',
                isArray: true,
                params: {
                    isDeleted: false
                }
            },

            getFormationReport: {method: 'GET', url: config.api.uri + base + '/:id/formation-report'},

            generateDownAndDistanceReport: {
                method: 'POST',
                url: config.api.uri + base + '/:id/dnd-report'
            },

            generateStats: {
                method: 'GET',
                url: url + '/stats',
                isArray: true
            },

            retrieveArenaEvents: {
                method: 'GET',
                isArray: true,
                url: config.api.uri + base + '/:id/arena-events'
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
