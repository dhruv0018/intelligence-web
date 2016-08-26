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
            },

            getIndexingWeeklySettings: {
                method: 'GET',
                url: `${url}indexer-group-allocations/:sportId`,
                params: {sportId: '@sportId', startDate: '@startDate', endDate: '@endDate'}
            },

            updateIndexingWeeklySettings: {
                method: 'PUT',
                url: `${url}indexer-group-allocations/:sportId`
            },

            createDistriubtionBatchReservation: {
                method: 'POST',
                url: `${url}breakdown-distribution-batches/`
            },

            runIndexerGroupDistribution: {
                method: 'PUT',
                url: `${url}breakdown-distribution-batches/:id`,
                params: {id: '@id'}
            },

            getDistributionBatchHistory: {
                method: 'GET',
                url: `${url}breakdown-distribution-batches/:id`,
                params: {id: '@id'}
            },

            getDistributionLog: {
                method: 'GET',
                url: `${url}distribution-logs`,
                params: {date: '@date'}
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
