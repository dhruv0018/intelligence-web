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
            },

            getIndexerGroupAllocationTypes: {
                method: 'GET',
                url: `${url}indexer-group-allocation-types`
            },

            getIndexerGroupsAllocationPermissions: {
                method: 'GET',
                url: `${url}indexer-group-allocation-permissions`,
                params: {sportId: '@sportId'}
            },

            updateIndexerGroupsAllocationPermissions: {
                method: 'POST',
                url: `${url}indexer-group-allocation-permissions`
            },

            getWeeklyIndexingProjections: {
                method: 'GET',
                url: `${url}indexing-projections/:sportId`,
                params: {sportId: '@sportId', startDate: '@startDate', endDate: '@endDate'}
            },

            updateWeeklyIndexingProjections: {
                method: 'PUT',
                url: `${url}indexing-projections/:sportId`
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
