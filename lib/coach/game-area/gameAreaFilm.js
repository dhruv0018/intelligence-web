/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Film page module.
 * @module GameArea
 */
var GameAreaFilm = angular.module('game-area-film', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaFilm.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaFilm.html', require('./gameAreaFilm.html'));
    }
]);

GameAreaFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-film',
            url: '/film',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaFilm.html',
                    controller: 'GameAreaFilmController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFilm.controller('GameAreaFilmController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'GAME_STATUS_IDS',
    function controller($scope, $state, $stateParams, games, GAME_STATUS_IDS) {
        $scope.gameId = $state.params.id;

        games.get($scope.gameId, function (game) {
            $scope.gameStatus = GAME_STATUS_IDS[game.status];
            $scope.sources = game.getVideoSources();
        });


    }
]);
