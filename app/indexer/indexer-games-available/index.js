/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGamesAvailable = angular.module('IndexerGamesAvailable', []);

import IndexerGamesAvailableData from './data';
import IndexerGamesAvailableController from './controller';

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
                        templateUrl: 'app/indexer/indexer-games-available/template.html',
                        controller: IndexerGamesAvailableController
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexerGamesService', 'VIEWS', 'LeaguesFactory',
                        function($q, IndexerGamesService, VIEWS, leagues) {
                            IndexerGamesService.queryFilter = VIEWS.QUEUE.GAME.READY_FOR_QA;
                            return IndexerGamesService.query();
                        }
                    ]
                }
            });
    }
]);

export default IndexerGamesAvailable;
