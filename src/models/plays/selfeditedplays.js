const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SelfEditedPlaysResource', [
    'config', '$resource',
    function(config, $resource) {

        const base = 'plays/self-edited';

        let url = `${config.api.uri}${base}/:id`;

        let paramDefaults = {

            id: '@id'

        };

        let actions = {

            filter: {
                method: 'POST',
                url: `${config.api.uri}plays/self-edited/filter/:filterId`,
                params: {
                    filterId: '@filterId'
                }
            },
            create: { method: 'POST' },
            update: { method: 'PUT' },
            batchUpdate: {
                method: 'POST',
                url: `${config.api.uri}plays/self-edited/batch`,
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
