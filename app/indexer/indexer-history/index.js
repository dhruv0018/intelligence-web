/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

import IndexingGamesDataDependencies from '../indexer-games/data.js';
import GamesController from '../indexer-games/controller.js';
import template from './template.html.js';

const templateUrl = './template.html';

/**
 * Indexer Games module.
 * @module Games
 */
var Games = angular.module('indexer-history', []);

Games.factory('IndexingGamesDataDependencies', IndexingGamesDataDependencies);

/* Cache the template file */
Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Games page state router.
 * @module Games
 * @type {UI-Router}
 */
Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('indexer-history', {
                url: '/history',
                parent: 'indexer',
                views: {
                    'main@root': {
                        templateUrl,
                        controller: GamesController
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

export default Games;
