/*globals require*/
/* Constants */
let TO = '';
let ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * uploadStatus
 * @module uploadStatus
 */
const UploadStatus = angular.module('uploadStatus', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
UploadStatus.run([
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
UploadStatusDirective.$inject = [
    '$window',
    'GAME_STATUSES',
    'UploadManager'
];

function UploadStatusDirective(
    $window,
    GAME_STATUSES,
    uploadManager
) {

    const uploadStatus = {

        restrict: TO += ELEMENTS,
        templateUrl: 'upload-status.html',
        replace: true,
        scope: {
            game: '='
        },
        link: function uploadStatusLink(scope, element, attrs) {

            scope.uploadModel = uploadManager.get(scope.game.id);
            scope.GAME_STATUSES = GAME_STATUSES;

            scope.failed = () => {

                // NOTE: The upload surely failed if there is no upload in progress,
                // but the server thinks that there is still (e.g. if user refreshses during upload)
                if (!scope.uploadModel) {

                    return scope.game.video.isIncomplete();

                } else {

                    // NOTE: The failure could come from server or client-side
                    return scope.uploadModel.isFailed() ||
                        scope.game.video.isFailed();
                }
            };

            scope.isUploading = () => {

                if (!scope.uploadModel) return false;

                // NOTE: Both the server/client should be in sync at this point
                return scope.uploadModel.isUploading() && scope.game.video.isIncomplete();
            };

            /**
             * The video has uploaded if the upload model says so or the Video
             * thinks that it has.
             */
            scope.isUploaded = () => {

                // NOTE: Both the server/client may not be in sync at this poiknt
                return (scope.uploadModel && scope.uploadModel.isUploaded()) || scope.game.video.isUploaded();
            };
        }
    };

    return uploadStatus;
}

UploadStatus.directive('uploadStatus', UploadStatusDirective);
