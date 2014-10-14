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
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory',
                    function($q, $stateParams, games, teams, users) {
                        var gameId = Number($stateParams.id);
                        var game = games.load(gameId);

                        var Data = {
                            game: game,
                            user: users.load(game.uploaderUserId),
                            team: teams.load(game.teamId),
                            opposingTeam: teams.load(game.opposingTeamId)
                        };

                        return $q.all(Data);
                    }
                ]
            }
        };

        $stateProvider.state(Games);
    }
]);

Games.controller('Games.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($scope, $state, $stateParams, leagues, games, teams, users) {
        var gameId = $stateParams.id;
        $scope.game = games.get(gameId);

        $scope.teams = teams.getCollection();
        $scope.team = $scope.teams[$scope.game.teamId];
        $scope.opposingTeam = $scope.teams[$scope.game.opposingTeamId];

        $scope.uploadedBy = users.get($scope.game.uploaderUserId);

        $scope.sources = $scope.game.getVideoSources();
        $scope.videoTitle = 'rawFilm';
    }
]);

