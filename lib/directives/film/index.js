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
                game: '=',
                teams: '='
            },
            replace: true,
            link: function($scope, element, attrs) {

                var currentUser = session.currentUser;
                $scope.currentUser = currentUser;
                $scope.COACH = ROLES.COACH;
                $scope.ATHLETE = ROLES.ATHLETE;

                $scope.isShared = $scope.game.isSharedWithUser(currentUser);

                $scope.ShareFilmModal = ShareFilmModal;

                var uploaderUser = users.get($scope.game.uploaderUserId);
                $scope.uploaderName = '';

                if ($scope.isShared) {
                    uploaderUser = users.get($scope.game.getShareByUser(currentUser).userId);
                }

                if (uploaderUser.id === currentUser.id) {
                    $scope.uploaderName = 'you';
                } else {
                    $scope.uploaderName = uploaderUser.firstName + ' ' + uploaderUser.lastName;
                }

                $scope.isReady = false;
                if ($scope.game.isDelivered() || $scope.game.isShared()) {
                    $scope.isReady = true;
                }
            }
        };

        return film;
    }
]);
