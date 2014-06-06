/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Formation Report page module.
 * @module GameArea
 */
var GameAreaDownDistance = angular.module('game-area-down-distance', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaDownDistance.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaDownDistance.html', require('./gameAreaDownDistance.html'));
    }
]);

GameAreaDownDistance.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-down-distance',
            url: '/downanddistance',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaDownDistance.html',
                    controller: 'GameAreaDownDistanceController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaDownDistance.controller('GameAreaDownDistanceController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {


    }
]);

