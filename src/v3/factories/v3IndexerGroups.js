//To load data run: v3IndexerGroupsFactory.load().then(...);
//To Create data run: something like below:
// let v3Data = {
//     attributes : {
//         name: 'Test Marketplace'
//     },
//     relationships:{
//         'obj1': {
//             'data' : {
//                 'type': 'type1',
//                 'id': 9
//             }
//         }
//     }
// };
// let v3CreatedObj = v3IndexerGroupsFactory.create(v3Data);
//TO save the above data, run: v3CreatedObj.save();
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3IndexerGroupsFactory', [
    '$injector',
    'v3BaseFactory',
    function(
        $injector,
        v3BaseFactory
    ) {

        const IndexerGroupsFactory = {
            description: 'indexer-groups',

            extend: function(indexerGroups){
                let self = this;

                angular.augment(indexerGroups, self);
                indexerGroups.label = indexerGroups.attributes.name.substr(0,2);

                return indexerGroups;
            },

            unextend: function(indexerGroups){
                let self = this;

                indexerGroups = indexerGroups || self;

                let copy = v3BaseFactory.unextend(indexerGroups);

                delete copy.label;

                return copy;
            }
        };

        angular.augment(IndexerGroupsFactory, v3BaseFactory);

        return IndexerGroupsFactory;
    }
]);
