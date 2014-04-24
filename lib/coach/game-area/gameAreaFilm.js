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
    '$scope', '$state', '$stateParams', 'GamesFactory', 'GAME_STATUS_IDS', 'PlaysFactory',
    function controller($scope, $state, $stateParams, games, GAME_STATUS_IDS, plays) {
        $scope.gameId = $state.params.id;
        $scope.filterId = '';

        games.get($scope.gameId, function (game) {
            $scope.game = game;
            $scope.gameStatus = GAME_STATUS_IDS[game.status];
            $scope.sources = game.getVideoSources();

            plays.getList($scope.gameId, function (plays) {
                console.log('got the data');
                console.log(plays);
                $scope.plays = plays;

                $scope.resources = {
                    game: $scope.game,
                    plays: $scope.plays
                };

            });
        });

        $scope.$watch('filterId', function(filterId) {
            console.log(filterId);
            console.log(filterId);

            if(filterId.length > 0) {
                plays.filterPlays({
                    filterId: $scope.filterId
                }, $scope.resources, function(plays) {
                    $scope.plays = plays[$scope.gameId];
                });
            }
        });

        $scope.testFilter = function() {
            $scope.filterId = '39';
        };


    }
]);
