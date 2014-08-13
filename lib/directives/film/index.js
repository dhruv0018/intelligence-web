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
    'TeamsFactory', 'UsersFactory', 'SessionService',
    function directive(teams, users, session) {

        var film = {

            restrict: TO += ELEMENTS,
            templateUrl: 'film.html',
            scope: {
                game: '=',
                teams: '='
            },
            replace: true,
            link: function($scope, element, attrs) {
                var uploaderUser = users.get($scope.game.uploaderUserId);
                var currentUser = session.currentUser;
                $scope.uploaderName = '';

                if (uploaderUser.id === currentUser.id) {
                    $scope.uploaderName = 'you';
                } else {
                    $scope.uploaderName = uploaderUser.firstName + ' ' + uploaderUser.lastName;
                }
            }
        };

        return film;
    }
]);
