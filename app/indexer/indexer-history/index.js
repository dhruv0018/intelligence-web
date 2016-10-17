/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerHistory = angular.module('IndexerHistory', []);

import IndexerDataDependencies from '../data';
import controller from './controller';

IndexerHistory.factory('IndexerDataDependencies', IndexerDataDependencies);

IndexerHistory.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerHistory', {
                url: '/history',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        templateUrl: 'app/indexer/indexer-history/template.html',
                        controller
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexerDataDependencies',
                        function($q, IndexerHistoryData) {
                            let data = new IndexerHistoryData();
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

export default IndexerHistory;
