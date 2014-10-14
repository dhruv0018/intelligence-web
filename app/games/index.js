/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach game area raw film page module.
 * @module Games
 */
var Games = angular.module('Games', [
    'ui.router',
    'ui.bootstrap'
]);

Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/template.html', require('./template.html'));
    }
]);

Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var Games = {
            name: 'Games',
            url: '/games/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'games/template.html',
                    controller: 'Games.controller'
                }
            },
            resolve: {
                'Games.Data': [
                    '$stateParams', 'GamesFactory',
                    function($stateParams, games) {
                        var gameId = $stateParams.id;
                        var game = games.get(gameId);
                        console.log(game);
                    }
                ]
            }
        };

        $stateProvider.state(Games);
    }
]);

Games.controller('Games.controller', [
    '$scope', '$state', '$stateParams', 'LeaguesFactory', 'GamesFactory', 'PlaysFactory',
    function controller($scope, $state, $stateParams, leagues, games, plays) {
        //$scope.data = data;
        //$scope.teamId = data.game.teamId;
        $scope.leagues = leagues.getCollection();
        //$scope.league = $scope.leagues[$scope.team.leagueId];
        //$scope.sources = data.game.getVideoSources();
        $scope.videoTitle = 'rawFilm';
    }
]);

