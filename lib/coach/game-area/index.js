require('./uploading');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area page module.
 * @module GameArea
 */
var GameArea = angular.module('game-area', [
    'ui.router',
    'ui.bootstrap',
    'uploading-film'
]);

/* Cache the template file */
GameArea.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/template.html', require('./template.html'));
    }
]);

/**
 * GameArea page state router.
 * @module AddFilm
 * @type {UI-Router}
 */
GameArea.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'game-area',
            url: '/game-area/:id',
            parent: 'coach',
            views: {
                'main@root': {
                    templateUrl: 'coach/game-area/template.html',
                    controller: 'GameAreaController'
                },
                'content@game-area': {
                    templateUrl: 'coach/game-area/uploading.html',
                    controller: 'GameAreaController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

/**
 * GameArea controller.
 * @module GameArea
 * @name GameAreaController
 * @type {Controller}
 */
GameArea.controller('GameAreaController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {
        $scope.gameId = $stateParams.id;

        games.get($scope.gameId, function(game) {
            $scope.game = game;
        });


    }
]);


