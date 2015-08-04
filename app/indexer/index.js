/* Component dependencies */
import IndexerGame from './indexer-game/';
import IndexerGames from './indexer-games/';
import IndexerHistory from './indexer-history/';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Indexer module.
 * @module Indexer
 */
const Indexer = angular.module('Indexer', [
    'IndexerGame',
    'IndexerGames',
    'IndexerHistory'
]);

/**
 * Indexer state router.
 * @module Indexer
 * @type {UI-Router}
 */
Indexer.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('Indexer', {
                url: '/indexer',
                parent: 'base',
                abstract: true
            });
    }
]);

export default Indexer;
