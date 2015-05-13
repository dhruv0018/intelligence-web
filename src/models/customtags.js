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
                /*
                 * Hide untill querying by isActive works
                 * params: {
                 *    isActive: true
                 *}
                 */
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
