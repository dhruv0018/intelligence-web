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
    '$state',
    function directive($state) {

        var thumbnail = {

            restrict: TO += ELEMENTS,
            templateUrl: 'thumbnail.html',
            replace: true,
            scope: {
                game: '='
            },
            link: function (scope, element, attrs) {
                scope.width = attrs.width || '200';
                scope.height = attrs.height || '200';

                scope.thumbnail = '';

                scope.$watch('game', function (game) {

                    if (scope.game && scope.game.video && scope.game.video.thumbnail) {
                        if(scope.game.video.thumbnail.length > 0){
                            scope.thumbnail = game.video.thumbnail;
                        }
                    }
                });
            }
        };

        return thumbnail;
    }
]);
