/* Component dependencies */
//require('indexer-game');
import Games from './indexer-games/index';
import GamesHistory from './indexer-history/index';


/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexer module.
 * @module Indexer
 */
var Indexer = angular.module('indexer', [
    'indexer-game',
    'indexer-games',
    'indexer-history'
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

            .state('indexer', {
                url: '/indexer',
                parent: 'base',
                abstract: true
            });
    }
]);
