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
            }

        };

        angular.augment(IndexerFactory, BaseFactory);

        return IndexerFactory;
    }
]);
