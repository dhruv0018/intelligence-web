var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ReelsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'reels';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

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
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
