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
    'GameUploadStateService'
];

function UploadingControlsDirective(
    $state,
    $window,
    FileUploadService,
    GameUploadStateService
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

            scope.GameUploadStateService = GameUploadStateService;

            scope.cancel = function() {

                let uploadModel = FileUploadService.get(scope.film.id);

                if (!uploadModel) return;

                uploadModel.cancel();

                scope.film.remove().then(() => {
                    $state.go(scope.redirectState);
                });
            };

            scope.getProgressBarType = () => {

                if (GameUploadStateService.isUploading(scope.film)) {
                    return 'warning';
                } else if (GameUploadStateService.isFailed(scope.film)) {
                    return 'danger';
                } else if (GameUploadStateService.isUploaded(scope.film)) {
                    return 'success';
                } else {
                    return null;
                }
            };
        }
    };
}

UploadingControls.directive('uploadingControls', UploadingControlsDirective);
