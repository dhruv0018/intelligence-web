/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGamesAvailable = angular.module('IndexerGamesAvailable', []);

import IndexerDataDependencies from '../data';
import IndexerGamesAvailableController from '../controller';
import template from './template.html';

IndexerGamesAvailable.factory('IndexerDataDependencies', IndexerDataDependencies);
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
                        '$q', 'IndexerDataDependencies',
                        function($q, IndexerGamesAvailableData) {
                            let data = new IndexerGamesAvailableData();
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

export default IndexerGamesAvailable;
