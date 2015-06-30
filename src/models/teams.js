var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TeamsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'teams';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },
            getRemainingBreakdowns: {
                method: 'GET',
                url: url + '/remainingBreakdowns'
            },
            generateStats: {
                method: 'GET',
                url: url + '/analytics',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
