/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGamesAssigned = angular.module('IndexerGamesAssigned', []);

import IndexerDataDependencies from '../data';
import IndexerGamesAssignedController from '../controller';

IndexerGamesAssigned.factory('IndexerDataDependencies', IndexerDataDependencies);
IndexerGamesAssigned.controller('IndexerGamesAssignedController', IndexerGamesAssignedController);

IndexerGamesAssigned.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('IndexerGamesAssigned', {
                url: '/games-assigned',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        templateUrl: 'app/indexer/indexer-games-assigned/template.html',
                        controller: IndexerGamesAssignedController
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexerDataDependencies',
                        function($q, IndexerGamesAssignedData) {
                            let data = new IndexerGamesAssignedData();
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

export default IndexerGamesAssigned;
