/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Thumbnail
 * @module Thumbnail
 */
const Thumbnail = angular.module('thumbnail', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Thumbnail directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Thumbnail.directive('krossoverThumbnail', [
    'ROLES', '$state', 'SessionService', 'ReelsFactory',
    function directive(ROLES, $state, session, reels) {

        const thumbnail = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/thumbnail/template.html',

            replace: true,

            scope: {
                film: '=',
                isGame: '='
            },

            link: link
        };

        function link($scope, elem, attrs) {
            $scope.COACH = ROLES.COACH;
            $scope.ATHLETE = ROLES.ATHLETE;

            $scope.currentUser = session.currentUser;

            $scope.width = attrs.width || '200';
            $scope.height = attrs.height || '200';

            $scope.thumbnail = '';

            $scope.reels = reels.getCollection();

            $scope.$watch('film', function(film) {

                if ($scope.film && $scope.film.video && $scope.film.video.thumbnail) {
                    if ($scope.film.video.thumbnail.length > 0) {
                        $scope.thumbnail = film.video.thumbnail;
                    }
                }
            });

            $scope.userIsCoachOnUploaderTeam =
                $scope.currentUser.is($scope.COACH) &&
                $scope.currentUser.currentRole.teamId === $scope.film.uploaderTeamId;
        }

        return thumbnail;
    }
]);

export default Thumbnail;
