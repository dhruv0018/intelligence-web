/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Film Breakdown page module.
 * @module GameArea
 */
var GameAreaRawFilm = angular.module('game-area-raw-film', [
    'ui.router',
    'ui.bootstrap',
    'Indexing'
]);

GameAreaRawFilm.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaRawFilm.html', require('./gameAreaRawFilm.html'));
    }
]);

GameAreaRawFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-raw-film',
            url: '/raw-film',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaRawFilm.html',
                    controller: 'GameAreaRawFilmController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaRawFilm.controller('GameAreaRawFilmController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'PlaysFactory', 'Coach.Data',
    function controller($scope, $state, $stateParams, games, plays, data) {
        $scope.gameId = $state.params.id;
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = data.leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];

    }
]);
