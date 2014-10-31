var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'players';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {
            singleCreate: {method: 'POST', url: config.api.uri + base},
            create: { method: 'POST', isArray: true, url: config.api.uri + 'batch/players' },
            update: { method: 'PUT' },
            resendEmail: { method: 'POST', url: config.api.uri + base + '/reminder-email'}
        };

        return $resource(url, paramDefaults, actions);
    }
]);

