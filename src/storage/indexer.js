const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('IndexerStorage', [
    'BaseStorage', 'IndexerFactory',
    function(BaseStorage, indexerFactory) {

        let IndexerStorage = Object.create(BaseStorage);

        IndexerStorage.factory = indexerFactory;
        IndexerStorage.description = indexerFactory.description;

        return IndexerStorage;
    }
]);
