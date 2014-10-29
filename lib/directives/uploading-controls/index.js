/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * UploadingControls
 * @module UploadingControls
 */
var UploadingControls = angular.module('uploadingControls', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
UploadingControls.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('uploadingControls.html', require('./template.html'));
    }
]);

/**
 * UploadingControls directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
UploadingControls.directive('uploadingControls', [
    '$state', '$window',
    function directive($state, $window) {

        var uploadingControls = {

            restrict: TO += ELEMENTS,
            templateUrl: 'uploadingControls.html',
            replace: true,
            scope: {
                flow: '=?',
                redirectState: '@',
                film: '=?'
            },
            link: function(scope, element, attrs) {

                $window.krossover = $window.krossover || {};
                $window.krossover.videoUploadStatus = 'STARTED';

                scope.cancel = function() {
                    scope.flow.cancel();
                    if (scope.film) {
                        scope.film.isDeleted = true;
                        scope.film.save();
                    }
                    $state.go(scope.redirectState);
                };

                scope.$on('flow::error', function(event, $flow, $message) {
                    scope.flow.cancel();
                });

            }
        };

        return uploadingControls;
    }
]);
