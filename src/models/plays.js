var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlaysResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'plays';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            filter: {
                method: 'POST',
                url: config.api.uri + 'plays/filter/:filterId',
                params: {
                    filterId: '@filterId'
                }
            },
            create: { method: 'POST' },
            update: { method: 'PUT' },
            batchUpdate: {
                method: 'POST',
                url: config.api.uri + 'plays/batch',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
