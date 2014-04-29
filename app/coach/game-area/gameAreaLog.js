/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Log page module.
 * @module GameArea
 */
var GameAreaLog = angular.module('game-area-log', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaLog.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaLog.html', require('./gameAreaLog.html'));
    }
]);

GameAreaLog.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-log',
            url: '/log',
            parent: 'ga-statistics',
            views: {
                'content@ga-statistics': {
                    templateUrl: 'coach/game-area/gameAreaLog.html',
                    controller: 'GameAreaLogController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaLog.controller('GameAreaLogController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {


    }
]);