require('game-info');
require('your-team');
require('opposing-team');
require('instructions');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Information page module.
 * @module GameArea
 */
var GameAreaInformation = angular.module('game-area-information', [
    'ui.router',
    'ui.bootstrap',
    'game-info',
    'your-team',
    'opposing-team',
    'instructions'
]);

GameAreaInformation.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaInformation.html', require('./gameAreaInformation.html'));
    }
]);

GameAreaInformation.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'game-area-information',
            url: '/game-area/:id/information',
            parent: 'coach',
            views: {
                'content@game-area': {
                    templateUrl: 'coach/game-area/gameAreaInformation.html',
                    controller: 'GameAreaInformationController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaInformation.controller('GameAreaInformationController', [
    '$scope', '$state', '$stateParams', 'GameAreaTabs', 'GamesFactory',
    function controller($scope, $state, $stateParams, tabs, games) {
        $scope.gameId = $stateParams.id;
        $scope.tabs = tabs;
        console.log($scope.tabs);
        games.get($scope.gameId, function(game) {
            $scope.game = game;
        });
    }
]);