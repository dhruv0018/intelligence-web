/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Thumbnail
 * @module Thumbnail
 */
var Thumbnail = angular.module('thumbnail', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Thumbnail.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('thumbnail.html', require('./template.html'));
    }
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

        var thumbnail = {

            restrict: TO += ELEMENTS,
            templateUrl: 'thumbnail.html',
            replace: true,
            scope: {
                film: '=',
                isGame: '='
            },
            link: function(scope, element, attrs) {

                scope.COACH = ROLES.COACH;
                scope.ATHLETE = ROLES.ATHLETE;

                scope.currentUser = session.currentUser;

                scope.width = attrs.width || '200';
                scope.height = attrs.height || '200';

                scope.thumbnail = '';

                scope.reels = reels.getCollection();

                scope.$watch('film', function(film) {

                    if (scope.film && scope.film.video && scope.film.video.thumbnail) {
                        if (scope.film.video.thumbnail.length > 0) {
                            scope.thumbnail = film.video.thumbnail;
                        }
                    }
                });
            }
        };

        return thumbnail;
    }
]);
