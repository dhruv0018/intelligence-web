const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('Iso3166countriesResource', [
    'config', '$resource',
    function(config, $resource) {

        const base = 'iso3166countries';

        let url = `${config.apiV2.uri}${base}`;

        let paramDefaults = {

            code: '@code'

        };

        let actions = {
            getRegions: { method: 'GET', url: `${url}/:code/iso3166regions`, isArray: true }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
