/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

import IndexingDataDependencies from '../data.js';
import IndexerGameController from './controller.js';
import template from './template.html.js';

const templateUrl = './template.html';
const IndexerGame = angular.module('IndexerGame', []);

IndexerGame.factory('IndexingDataDependencies', IndexingDataDependencies);
IndexerGame.controller('IndexerGameController', IndexerGameController);

/* Cache the template file */
IndexerGame.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Indexer game page state router.
 * @module Game
 * @type {UI-Router}
 */
IndexerGame.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('IndexerGame', {
                url: '/game/:id',
                parent: 'Indexer',
                views: {
                    'main@root': {
                        templateUrl,
                        controller: IndexerGameController
                    }
                },
                resolve: {
                    'Indexer.Game.Data': [
                        '$q', 'IndexingDataDependencies',
                        function($q, IndexingGamesData) {
                            let data = new IndexingGamesData();
                            return $q.all(data);
                        }
                    ]
                },
                onEnter: [
                    '$state', '$stateParams', 'SessionService', 'AlertsService', 'Indexer.Game.Data', 'GamesFactory',
                    function($state, $stateParams, session, alerts, data, games) {
                        var userId = session.currentUser.id;
                        var gameId = $stateParams.id;
                        var game = games.get(gameId);
                        var status = game.getStatus();
                        var indexable = game.isAssignedToIndexer() && game.canBeIndexed();
                        var qaAble = game.isAssignedToQa() && game.canBeQAed();

                        if (game.isAssignedToUser(userId) && (indexable || qaAble) && !game.isDeleted) {

                            alerts.add({
                                type: status.type,
                                message: status.name
                            });
                        }

                        else $state.go('401');
                    }
                ]
            });
    }
]);

export default IndexerGame;
