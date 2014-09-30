/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach game area raw film page module.
 * @module RawFilm
 */
var RawFilm = angular.module('Coach.GameArea.RawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

RawFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/game-area/raw-film/template.html', require('./template.html'));
    }
]);

RawFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Coach.GameArea.RawFilm',
            url: '/raw-film',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/raw-film/template.html',
                    controller: 'Coach.GameArea.RawFilm.controller'
                }
            }
        };

        $stateProvider.state(gameArea);
    }
]);

RawFilm.controller('Coach.GameArea.RawFilm.controller', [
    '$scope', '$state', '$stateParams', 'LeaguesFactory', 'GamesFactory', 'PlaysFactory', 'Coach.Data',
    function controller($scope, $state, $stateParams, leagues, games, plays, data) {
        $scope.gameId = $state.params.id;
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];
        $scope.sources = data.game.getVideoSources();
        $scope.videoTitle = 'rawFilm';
    }
]);

