/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGamesAvailable = angular.module('IndexerGamesAvailable', []);

import IndexerGamesAvailableData from './data';
import IndexerGamesAvailableController from './controller';
import template from './template.html';

IndexerGamesAvailable.factory('IndexerGamesAvailableData', IndexerGamesAvailableData);
IndexerGamesAvailable.controller('IndexerGamesAvailableController', IndexerGamesAvailableController);

IndexerGamesAvailable.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerGamesAvailable', {
                url: '/games-available',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        template,
                        controller: IndexerGamesAvailableController
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexerGamesService', 'VIEWS', 'LeaguesFactory',
                        function($q, IndexerGamesService, VIEWS, leagues) {
                            //let data = new IndexerGamesAvailableData();
                            //return $q.all(data);
                            let queries = [];
                            [
                                VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_1,
                                VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_2,
                                VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_3
                            ].forEach(priorityFilter => {
                                IndexerGamesService.queryFilter = priorityFilter;
                                queries.push(IndexerGamesService.query());
                            });
                            return $q.all(queries);
                        }
                    ]
                }
            });
    }
]);

export default IndexerGamesAvailable;
