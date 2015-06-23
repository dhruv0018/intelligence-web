/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerHistory = angular.module('IndexerHistory', []);

import IndexingDataDependencies from '../data.js';
import IndexerGamesController from '../indexer-games/controller.js';
import template from './template.html.js';

IndexerHistory.factory('IndexingDataDependencies', IndexingDataDependencies);
IndexerHistory.controller('IndexerGamesController', IndexerGamesController);

IndexerHistory.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerHistory', {
                url: '/history',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        template,
                        controller: IndexerGamesController
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexingDataDependencies',
                        function($q, IndexingGamesData) {
                            let data = new IndexingGamesData();
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

export default IndexerHistory;
