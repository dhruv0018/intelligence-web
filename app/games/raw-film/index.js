/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesRawFilm = angular.module('Games.RawFilm', []);

GamesRawFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/raw-film/template.html', require('./template.html'));
    }
]);

GamesRawFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var GamesRawFilm = {
            name: 'Games.RawFilm',
            url: '/raw-film',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/raw-film/template.html',
                    controller: 'Games.Rawfilm.controller'
                }
            },
            resolve: {
                'Games.Rawfilm.Data': [
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory',
                    function($q, $stateParams, games, teams, users) {

                        var gameId = Number($stateParams.id);

                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);

                            var Data = {
                                user: users.load(game.uploaderUserId),
                            };

                            var teamIds = [];
                            if (game.teamId) teamIds.push(game.teamId);
                            if (game.opposingTeamId) teamIds.push(game.opposingTeamId);
                            if (teamIds.length) Data.teams = teams.load(teamIds);

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(GamesRawFilm);
    }
]);

GamesRawFilm.controller('Games.Rawfilm.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory',
    function controller($scope, $state, $stateParams, games, teams) {
        var gameId = $stateParams.id;

        $scope.game = games.get(gameId);
        $scope.posterImage = {
            url: $scope.game.video.thumbnail
        };

        $scope.cuePoints = $scope.game.getRawTelestrationCuePoints();
        $scope.publiclyShared = false;

        //TODO remove some of this stuff later
        $scope.publiclyShared = true;
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        // Set telestrations
        $scope.telestrations = $scope.game.rawTelestrations;

        $scope.sources = $scope.game.getVideoSources();

    }
]);

