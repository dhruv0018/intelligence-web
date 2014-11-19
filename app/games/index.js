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

        var shortGames = {
            name: 'ShortGames',
            url: '/g/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var gameId = parseInt($stateParams.id, 36);
                    $state.go('Games', {id: gameId});
                }
            ]
        };

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
                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.teamId, game.opposingTeamId])
                            };

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(shortGames);
        $stateProvider.state(Games);
    }
]);

Games.controller('Games.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($scope, $state, $stateParams, games, teams, users) {
        var gameId = $stateParams.id;
        $scope.game = games.get(gameId);
        $scope.publiclyShared = false;

        if ($scope.game.isSharedWithPublic()) {
            $scope.publiclyShared = true;
            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

            $scope.uploadedBy = users.get($scope.game.uploaderUserId);

            $scope.sources = $scope.game.getVideoSources();
            $scope.filmTitle = $scope.game.description;
        }
    }
]);

