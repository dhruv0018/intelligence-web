/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

import IndexingGamesDataDependencies from '../indexer-games/data.js';
import IndexerGamesController from '../indexer-games/controller.js';
import template from './template.html.js';

const templateUrl = './template.html';
const IndexerHistory = angular.module('IndexerHistory', []);

IndexerHistory.factory('IndexingGamesDataDependencies', IndexingGamesDataDependencies);
IndexerHistory.controller('IndexerGamesController', IndexerGamesController);

/* Cache the template file */
IndexerHistory.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

IndexerHistory.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerHistory', {
                url: '/history',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        templateUrl,
                        controller: IndexerGamesController
                    }
                },
                resolve: {
                    'Indexer.Games.Data': [
                        '$q', 'IndexingGamesDataDependencies',
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
