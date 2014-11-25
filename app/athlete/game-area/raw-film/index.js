/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete game area raw film page module.
 * @module RawFilm
 */
var RawFilm = angular.module('Athlete.GameArea.RawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

RawFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/game-area/raw-film/template.html', require('./template.html'));
    }
]);

RawFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Athlete.GameArea.RawFilm',
            url: '/raw-film',
            parent: 'Athlete.GameArea',
            views: {
                'content@Athlete.GameArea': {
                    templateUrl: 'athlete/game-area/raw-film/template.html',
                    controller: 'Athlete.GameArea.RawFilm.controller'
                }
            }
        };

        $stateProvider.state(gameArea);
    }
]);

RawFilm.controller('Athlete.GameArea.RawFilm.controller', [
    '$scope', '$state', '$stateParams', 'LeaguesFactory', 'GamesFactory', 'PlaysFactory', 'Athlete.Data', 'PlayManager',
    function controller($scope, $state, $stateParams, leagues, games, plays, data, playManager) {

        $scope.gameId = $state.params.id;
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];
        $scope.sources = data.game.getVideoSources();
        playManager.videoTitle = 'rawFilm';
    }
]);

