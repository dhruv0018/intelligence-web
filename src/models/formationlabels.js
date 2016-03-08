const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FormationLabelsResource', [
    'config', '$resource',
    function(config, $resource) {

        const base = 'team-football-formation-labels';

        let url = `${config.api.uri}${base}/:id`;

        let paramDefaults = {

            id: '@id'

        };

        let actions = {

            filter: {
                method: 'POST',
                url: `${config.api.uri}${base}/filter/:filterId`,
                params: {
                    filterId: '@filterId'
                }
            },
            create: { method: 'POST' },
            update: { method: 'PUT' }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
