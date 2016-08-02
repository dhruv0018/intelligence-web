const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('IndexerResource', [
    'config', '$resource',
    function(config, $resource) {

        let url = `${config.apiV3.uri}`;

        let paramDefaults = {};

        let actions = {
            getIndexerGroups: {
                method: 'GET',
                url: `${url}indexer-groups`
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
