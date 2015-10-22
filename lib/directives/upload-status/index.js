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
    'GAME_STATUSES'
];

function UploadStatusDirective(
    $window,
    GAME_STATUSES
) {

    const uploadStatus = {

        restrict: TO += ELEMENTS,
        templateUrl: 'upload-status.html',
        replace: true,
        scope: {
            game: '='
        },
        link: function uploadStatusLink(scope) {

            // TODO: Add methods to game for getting statuses
            scope.GAME_STATUSES = GAME_STATUSES;
        }
    };

    return uploadStatus;
}

UploadStatus.directive('uploadStatus', UploadStatusDirective);
