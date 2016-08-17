const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'indexer';
const model = 'IndexerResource';
const storage = 'IndexerStorage';

IntelligenceWebClient.factory('IndexerFactory', [
    '$injector',
    'BaseFactory',
    function(
        $injector,
        BaseFactory
    ) {

        const IndexerFactory = {

            description,
            model,
            storage,

            getIndexerGroups() {
                const model = $injector.get(this.model);
                return model.getIndexerGroups().$promise;
            },

            getIndexerGroupAllocationTypes() {
                const model = $injector.get(this.model);
                return model.getIndexerGroupAllocationTypes().$promise;
            },

            getIndexerGroupsAllocationPermissions(sportId) {
                const model = $injector.get(this.model);
                return model.getIndexerGroupsAllocationPermissions({sportId}).$promise;
            },

            updateIndexerGroupsAllocationPermissions(updatedPermissions) {
                const model = $injector.get(this.model);
                return model.updateIndexerGroupsAllocationPermissions(updatedPermissions).$promise;
            },

            getWeeklyIndexingProjections(filter) {
                const model = $injector.get(this.model);
                return model.getWeeklyIndexingProjections(filter).$promise;
            }

        };

        angular.augment(IndexerFactory, BaseFactory);

        return IndexerFactory;
    }
]);
