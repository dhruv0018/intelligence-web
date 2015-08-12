/* Fetch angular from the browser scope */
const angular = window.angular;
const IndexerGamesAvailable = angular.module('IndexerGamesAvailable', []);

import IndexerDataDependenciess from './data';
import IndexerGamesAvailableControllers from './controller';
import template from './template.html';

IndexerGamesAvailable.factory('IndexerDataDependenciess', IndexerDataDependenciess);
IndexerGamesAvailable.controller('IndexerGamesAvailableControllers', IndexerGamesAvailableControllers);

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
                        controller: IndexerGamesAvailableControllers
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexerDataDependenciess',
                        function($q, IndexerGamesAvailableData) {
                            console.log('IndexerGamesAvailableData', IndexerGamesAvailableData);
                            let data = new IndexerGamesAvailableData();
                            console.log('data', data);
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

export default IndexerGamesAvailable;
