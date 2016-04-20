const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('AssociationsResource', [
    'config', '$resource',
    function(config, $resource) {

        const base = 'sports-associations';

        let url = `${config.api.uri}${base}/:id`;

        let paramDefaults = {

            id: '@id',

        };

        let actions = {
            create: { method: 'POST' },
            update: { method: 'PUT' },
            getCompetitionLevels: { method: 'GET', url: `${config.api.uri}${base}/:code/competition-levels`, isArray: true},
            createCompetitionLevels: { method: 'POST', url: `${config.api.uri}${base}/:associationCode/competition-levels`, params: {associationCode: '@associationCode'}}
        };

        return $resource(url, paramDefaults, actions);
    }
]);
