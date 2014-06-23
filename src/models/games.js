var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('GamesResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'games';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },
            generateDownAndDistanceReport: {
                method: 'POST',
                url: config.api.uri + base + '/:id/dnd-report'
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);

