const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('CustomtagsResource', [
    'config', '$resource',
    function(config, $resource) {

        const base = 'custom-tags';

        const url = config.api.uri + base + '/:id';

        const paramDefaults = {

            id: '@id'

        };

        const actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },

            query: {
                method: 'GET',
                isArray: true,
                params: {
                    isActive: 1
                }
            },

            batchUpdate: {
                method: 'POST',
                url: config.api.uri + 'custom-tags/batch',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
