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
            film: '=?'
        },
        link: function uploadControlsLink(scope) {

            scope.uploadManager = uploadManager;

            scope.cancel = function() {

                if (scope.film) {

                    uploadManager.cancel(scope.film.id);
                    scope.film.remove().then(() => {
                        $state.go(scope.redirectState);
                    });
                }
            };

            scope.getProgressBarType = () => {

                if (scope.film.video.isIncomplete()) {
                    return 'warning';
                } else if (scope.film.video.isFailed()) {
                    return 'danger';
                } else if (scope.film.video.isUploaded() || scope.film.video.isComplete()) {
                    return 'success';
                }
            };
        }
    };
}

UploadingControls.directive('uploadingControls', UploadingControlsDirective);
