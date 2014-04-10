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
            url: '',
            parent: 'game-area',
            views: {
                'content@game-area': {
                    templateUrl: 'coach/game-area/gameAreaFilm.html',
                    controller: 'GameAreaFilmController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFilm.controller('GameAreaFilmController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {
        $scope.gameId = $state.params.id;

        games.get($scope.gameId, function (game) {
            console.log(game);
            console.log(game.video.videoTranscodeProfiles[0].videoUrl);

            $scope.sources = [
                {
                    url: game.video.videoTranscodeProfiles[0].videoUrl
                }
            ];

        });


    }
]);
