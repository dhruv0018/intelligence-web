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
    function directive() {

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

                var thumbnailIndex = Math.floor(Math.random() * 3);

                scope.thumbnail =  {
                    url: 'assets/tmp/thumbnail/000' + thumbnailIndex + '_basketball_game.jpg'
                };

                //TODO substitute with real property when thumbnail exists
                var thumbnailProperty = 'thumbnail';

//                scope.$watch('game', function (game) {
//                    if (scope.game && scope.game.video) {
//                        //TODO renable after demos
//                        scope.thumbnail = game.video[thumbnailProperty];
//
//                    }
//                });
            }
        };

        return thumbnail;
    }
]);
