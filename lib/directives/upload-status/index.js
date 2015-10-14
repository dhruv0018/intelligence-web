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
        }
    };

    return uploadStatus;
}

UploadStatus.directive('uploadStatus', UploadStatusDirective);
