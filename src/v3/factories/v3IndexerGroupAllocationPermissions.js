const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3IndexerGroupAllocationPermissionsFactory', [
    '$injector',
    'v3BaseFactory',
    function(
        $injector,
        v3BaseFactory
    ) {

        const IndexerGroupAllocationPermissionsFactory = {

            description: 'indexer-group-allocation-permissions'

        };

        angular.augment(IndexerGroupAllocationPermissionsFactory, v3BaseFactory);

        return IndexerGroupAllocationPermissionsFactory;
    }
]);
