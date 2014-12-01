/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film
 * @module Film
 */
var Film = angular.module('film', [
    'ui.router',
    'ui.bootstrap',
    'thumbnail'
]);

/* Cache the template file */
Film.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('film.html', require('./template.html'));
    }
]);

/**
 * Film directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Film.directive('krossoverFilm', [
    'ROLES', 'TeamsFactory', 'UsersFactory', 'GamesFactory', 'SessionService', 'ShareFilm.Modal', 'GAME_TYPES_IDS', 'GAME_TYPES',
    function directive(ROLES, teams, users, games, session, ShareFilmModal, GAME_TYPES_IDS, GAME_TYPES) {

        var film = {

            restrict: TO += ELEMENTS,

            templateUrl: 'film.html',

            scope: {
                film: '=',
                teams: '='
            },

            replace: true,

            link: function($scope, element, attrs) {

                var currentUser = session.currentUser;
                $scope.currentUser = currentUser;
                $scope.COACH = ROLES.COACH;
                $scope.ATHLETE = ROLES.ATHLETE;

                //Check if film is a game or reel
                $scope.isGame = angular.isDefined($scope.film.gameType);

                //Check if game is shared with user
                $scope.isShared = $scope.film.isSharedWithUser(currentUser) ||
                                  ($scope.isGame && $scope.film.isSharedWithTeam() && $scope.film.uploaderUserId != currentUser.id);

                $scope.uploaderName = '';

                $scope.hideFilm = false;

                if (currentUser.is(ROLES.ATHLETE) && $scope.isGame && !$scope.film.isVideoTranscodeComplete()) {
                    $scope.hideFilm = true;
                } else if ($scope.isShared && $scope.isGame && !$scope.film.isVideoTranscodeComplete()) {
                    $scope.hideFilm = true;
                }

                $scope.ShareFilmModal = ShareFilmModal;

                var uploaderUser = {};
                $scope.uploaderName = '';

                if ($scope.isShared) {
                    uploaderUser = users.get($scope.film.getShareByUser(currentUser).userId);
                } else {
                    uploaderUser = users.get($scope.film.uploaderUserId);
                }

                if (uploaderUser.id === currentUser.id) {
                    $scope.uploaderName = 'you';
                } else {
                    $scope.uploaderName = uploaderUser.firstName + ' ' + uploaderUser.lastName;
                }

                if ($scope.isGame) {
                    $scope.isReady = false;
                    if ($scope.film.isDelivered() || $scope.film.isShared()) {
                        $scope.isReady = true;
                    }
                }

                switch ($scope.film.description) {
                    case 'games':
                        var gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
                        var gameType = GAME_TYPES[gameTypeId];
                        $scope.filmTitle = gameType.name;
                        break;
                    case 'reels':
                        $scope.filmTitle = 'Reel';
                        break;
                    default:
                        $scope.filmTitle = 'Other';
                }
            }
        };

        return film;
    }
]);
