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
    'ROLES', 'TeamsFactory', 'UsersFactory', 'GamesFactory', 'SessionService', 'ShareFilm.Modal',
    function directive(ROLES, teams, users, games, session, ShareFilmModal) {

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

                $scope.isShared = $scope.film.isSharedWithUser(currentUser);

                $scope.uploaderName = '';

                $scope.isGame = angular.isDefined($scope.film.gameType);

                $scope.hideFilm = false;

                if (currentUser.is(ROLES.ATHLETE) && !$scope.film.isVideoTranscodeComplete()) {
                    $scope.hideFilm = true;
                } else if ($scope.isShared && !$scope.film.isVideoTranscodeComplete()) {
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

                $scope.isReady = false;
                if ($scope.film.isDelivered() || $scope.film.isShared()) {
                    $scope.isReady = true;
                }
            }
        };

        return film;
    }
]);
