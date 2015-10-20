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
    'UploadManager'
];

function UploadingControlsDirective(
    $state,
    $window,
    uploadManager
) {

    return {
        restrict: TO += ELEMENTS,
        templateUrl: 'uploadingControls.html',
        replace: true,
        scope: {
            redirectState: '@',
            film: '='
        },
        link: function uploadControlsLink(scope) {

            scope.uploadModel = uploadManager.get(scope.film.id);

            // We want to see if a new upload model exists at any point in time
            // or if the upload model has been removed
            scope.$watch(
                function() {
                    return uploadManager.get(scope.film.id);
                },
                function() {
                    scope.uploadModel = uploadManager.get(scope.film.id);
                }
            );

            scope.cancel = function() {

                if (!scope.uploadModel) return;

                scope.uploadModel.cancel();
                scope.film.remove().then(() => {
                    $state.go(scope.redirectState);
                });
            };

            scope.isUploading = () => {

                if (!scope.uploadModel) return false;

                return scope.uploadModel.isUploading();
            };

            scope.getUploadProgress = () => {

                if (!scope.uploadModel) return 0;

                return scope.uploadModel.progress();
            };

            scope.getProgressBarType = () => {

                if (!scope.uploadModel) return null;

                if (scope.uploadModel.isUploading()) {
                    return 'warning';
                } else if (scope.uploadModel.isFailed()) {
                    return 'danger';
                } else if (scope.uploadModel.isUploaded()) {
                    return 'success';
                }
            };
        }
    };
}

UploadingControls.directive('uploadingControls', UploadingControlsDirective);
