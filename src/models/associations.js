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
            getCompetitionLevels: {
                method: 'GET',
                url: `${config.api.uri}${base}/:code/competition-levels`,
                isArray: true
            },
            createCompetitionLevel: {
                method: 'POST',
                url: `${config.api.uri}${base}/:code/competition-levels`,
                params: {code: '@code'}
            },
            updateCompetitionLevel: {
                method: 'PUT',
                url: `${config.api.uri}${base}/:associationCode/competition-levels/:compLevelCode`,
                params: {associationCode: '@associationCode', compLevelCode: '@compLevelCode'}
            },
            deleteCompetitionLevel: {
                method: 'DELETE',
                url: `${config.api.uri}${base}/:associationCode/competition-levels/:compLevelCode`,
                params: {associationCode: '@associationCode', compLevelCode: '@compLevelCode'}
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
