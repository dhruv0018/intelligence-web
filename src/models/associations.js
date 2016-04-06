const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('AssociationsResource', [
    'config', '$resource',
    function(config, $resource) {

        const base = 'sports-associations';

        let url = `${config.api.uri}${base}`;

        let paramDefaults = {

            code: '@code'

        };

        let actions = {
            create: { method: 'POST' },
            update: { method: 'PUT', url: `${url}/:code` }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
