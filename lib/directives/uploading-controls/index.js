/*globals require*/
/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * UploadingControls
 * @module UploadingControls
 */
const UploadingControls = angular.module('uploadingControls', [
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

UploadingControlsDirective.$inject = [
    '$state',
    '$window',
    'FileUploadService',
    'config'
];

function UploadingControlsDirective(
    $state,
    $window,
    FileUploadService,
    config
) {

    return {
        restrict: TO += ELEMENTS,
        templateUrl: 'uploadingControls.html',
        replace: true,
        scope: {
            redirectState: '@',
            game: '='
        },
        link: function uploadControlsLink(scope) {

            scope.progress = 0;
            scope.config = config;
            scope.fileUpload = FileUploadService.getFileUpload(scope.game.video.guid);
            scope.FileUploadService = FileUploadService;

            if (scope.fileUpload && scope.config.useS3Uploader) {
                scope.fileUpload.onProgress(function(progress){
                    scope.progress = progress;
                    scope.$apply();
                });
            }

            scope.cancel = function() {

                if (!scope.fileUpload) return;

                scope.fileUpload.cancel();

                scope.game.remove().then(() => {
                    $state.go(scope.redirectState);
                });
            };

            scope.getProgressBarType = () => {

                if (scope.game.video.isIncomplete()) {
                    return 'danger';
                } else if (scope.game.video.isFailed()) {
                    return 'danger';
                } else if (scope.game.video.isUploaded() || scope.game.video.isComplete()) {
                    return 'success';
                } else {
                    return null;
                }
            };
        }
    };
}

UploadingControls.directive('uploadingControls', UploadingControlsDirective);
