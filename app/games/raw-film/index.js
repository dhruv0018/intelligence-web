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
                                user: users.load(game.uploaderUserId)
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
    '$scope', '$stateParams', 'GamesFactory', 'ROLES', 'SessionService', 'UsersFactory', 'TELESTRATION_PERMISSIONS',
    function controller($scope, $stateParams, games, ROLES, session, users, TELESTRATION_PERMISSIONS) {

        /* Scope */

        // telestrations

        $scope.telestrations = $scope.game.rawTelestrations;

        // video player

        $scope.sources = $scope.game.getVideoSources();
        $scope.cuePoints = [];
        $scope.posterImage = {
            url: $scope.game.video.thumbnail
        };

        if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

            $scope.cuePoints = $scope.telestrations.getTelestrationCuePoints();
        }


        /* Listeners */

        if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

            $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

                $scope.cuePoints = $scope.telestrations.getTelestrationCuePoints();
            });
        }
    }
]);

