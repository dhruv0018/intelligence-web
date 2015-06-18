/* Fetch angular from the browser scope */
var angular = window.angular;
//might need to window.moment
var moment = require('moment');

import IndexingGamesDataDependencies from './data.js';
import GamesController from './controller.js';
import template from './template.html.js';

const templateUrl = './template.html';

/**
 * Indexer Games module.
 * @module Games
 */
var Games = angular.module('indexer-games', []);


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

            .state('indexer-games', {
                url: '/games',
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
                            console.log('DATA', data);
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

export default Games;
