const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

ArenaChartResourceFactory.$inject = [
    'config',
    '$resource'
];

function ArenaChartResourceFactory(
    config,
    $resource
) {

    const base = 'arena-chart';

    const url = config.api.uri + base + '/:id';

    const paramDefaults = {

        id: '@id'

    };

    const actions = {

        query: {
            method: 'GET',
            isArray: true
        }
    };

    return $resource(url, paramDefaults, actions);
}


IntelligenceWebClient.factory('ArenaChartResource', ArenaChartResourceFactory);
