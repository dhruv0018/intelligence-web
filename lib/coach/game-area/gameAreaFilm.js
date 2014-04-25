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
    '$scope', '$state', '$stateParams', 'GamesFactory', 'GAME_STATUS_IDS', 'Coach.Data',
    function controller($scope, $state, $stateParams, games, GAME_STATUS_IDS, data) {
        $scope.gameId = $state.params.id;

        data.then(function(data){
            $scope.game = data.game;

            try{
                $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
                $scope.sources = $scope.game.getVideoSources();
            } catch (e) {
                console.log('corrupted game');
                console.log(e);
            }

        });
    }
]);
