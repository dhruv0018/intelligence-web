/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PosterImage
 * @module PosterImage
 */
var PosterImage = angular.module('PosterImage', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
PosterImage.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('poster-image.html', require('./template.html'));
    }
]);

/**
 * PosterImage directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
PosterImage.directive('posterImage', [
    'GamesFactory', 'PlayManager', 'PlaysFactory',
    function directive(gamesFactory, playManager, playsFactory) {

        var PosterImage = {

            restrict: TO += ELEMENTS + ATTRIBUTES,
            templateUrl: 'poster-image.html',
            link: function(scope, element, attrs) {

                scope.$watch('playManager.current', function() {
                    if (playManager.current) {
                        scope.posterImageSrc = gamesFactory.get(playsFactory.get(playManager.current.id).gameId).video.thumbnail;
                    }
                });
            }
        };

        return PosterImage;
    }
]);
