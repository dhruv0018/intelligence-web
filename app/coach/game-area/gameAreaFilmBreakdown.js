/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Film Breakdown page module.
 * @module GameArea
 */
var GameAreaFilmBreakdown = angular.module('game-area-film-breakdown', [
    'ui.router',
    'ui.bootstrap',
    'Indexing'
]);

GameAreaFilmBreakdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaFilmBreakdown.html', require('./gameAreaFilmBreakdown.html'));
    }
]);

GameAreaFilmBreakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-film-breakdown',
            url: '/film-breakdown',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaFilmBreakdown.html',
                    controller: 'GameAreaFilmBreakdownController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFilmBreakdown.controller('GameAreaFilmBreakdownController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'PlaysFactory', 'FiltersetsFactory', 'Coach.Data',
    function controller($scope, $state, $stateParams, games, plays, filtersets, data) {
        $scope.gameId = $state.params.id;
        $scope.videoTitle = 'filmBreakdown';
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = data.leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];
        $scope.expandAll = false;
        $scope.playAllPlays = true;
    }
]);
