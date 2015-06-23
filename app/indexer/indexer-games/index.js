/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGames = angular.module('IndexerGames', []);

import IndexingDataDependencies from '../data.js';
import IndexerGamesController from './controller.js';
import template from './template.html.js';

IndexerGames.factory('IndexingDataDependencies', IndexingDataDependencies);
IndexerGames.controller('IndexerGamesController', IndexerGamesController);

IndexerGames.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerGames', {
                url: '/games',
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

export default IndexerGames;
