/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * uploadStatus
 * @module uploadStatus
 */
var uploadStatus = angular.module('uploadStatus', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
uploadStatus.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('upload-status.html', require('./template.html'));
    }
]);

/**
 * uploadStatus directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
uploadStatus.directive('uploadStatus', [
    '$window', 'GAME_STATUSES',
    function directive($window, GAME_STATUSES) {

        var uploadStatus = {

            restrict: TO += ELEMENTS,
            templateUrl: 'upload-status.html',
            replace: true,
            scope: {
                flow: '=?',
                game: '=?'
            },
            link: function(scope, element, attrs) {
                scope.GAME_STATUSES = GAME_STATUSES;

                scope.$on('flow::error', function(event, $flow, $message) {
                    scope.flow.cancel();
                    scope.error = true;
                    scope.$apply();
                });

                scope.$on('flow::complete', function() {
                    if (!scope.error) {
                        scope.complete = true;
                    }
                    scope.$apply();
                });
            }
        };

        return uploadStatus;
    }
]);
