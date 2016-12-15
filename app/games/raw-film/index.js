/* Fetch angular from the browser scope */
const angular = window.angular;

const GamesRawFilm = angular.module('Games.RawFilm', []);

GamesRawFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const GamesRawFilm = {
            name: 'Games.RawFilm',
            url: '/raw-film',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'app/games/raw-film/template.html',
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
    '$scope', '$stateParams', 'GamesFactory', 'ROLES', 'SessionService', 'UsersFactory', 'TELESTRATION_PERMISSIONS', 'TelestrationsVideoPlayerBroker',
    function controller($scope, $stateParams, games, ROLES, session, users, TELESTRATION_PERMISSIONS, TelestrationsVideoPlayerBroker) {

        /* Scope */
        let gameId = $stateParams.id;
        $scope.game = games.get(gameId);
        const telestrationsVideoPlayerBroker = new TelestrationsVideoPlayerBroker();

        // telestrations

        $scope.telestrations = $scope.game.rawTelestrations;


        $scope.disableDownload = ($scope.game.isCopiedFromBreakdownLibrary() && !session.currentUser.is(ROLES.COACH));

        // video player

        $scope.cuePoints = [];
        $scope.posterImage = {
            url: $scope.game.video.thumbnail
        };
        $scope.video = $scope.game.video;

        let removeTelestrationsSaveListener = angular.noop;

        if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

            $scope.cuePoints = $scope.telestrations.getTelestrationCuePoints();
        }


        /* Listeners & Watches */

        if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

            $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

                $scope.cuePoints = $scope.telestrations.getTelestrationCuePoints();
            });
        }

        if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

            removeTelestrationsSaveListener = $scope.$on('telestrations:save', saveTelestrations);
        }

        function saveTelestrations(event, callbackFn) {

            callbackFn = callbackFn || angular.noop;

            // Save Game
            $scope.game.save(null, null, null, true).then(function onSaved() {
                callbackFn();
            });

        }

        $scope.$on('$destroy', function onDestroy() {

            removeTelestrationsSaveListener();
            telestrationsVideoPlayerBroker.cleanup();
        });
    }
]);

export default GamesRawFilm;
