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
                redirectState: '@'
            },
            link: function(scope, element, attrs) {

                $window.krossover = $window.krossover || {};
                $window.krossover.videoUploadStatus = 'STARTED';

                //TODO: switch to addEventListener
                $window.onbeforeunload = function beforeunloadHandler() {

                    if (scope.flow.isUploading() ||
                        $window.krossover &&
                        ($window.krossover.videoUploadStatus === 'STARTED' && $window.krossover.videoUploadStatus !== 'COMPLETE')) {

                        return 'Video still uploading! Are you sure you want to close the page and cancel the upload?';
                    }
                };

                scope.cancel = function() {
                    scope.flow.cancel();
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
