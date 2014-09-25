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
    'GAME_STATUSES', 'GamesFactory',
    function directive(GAME_STATUSES) {

        var uploadStatus = {

            restrict: TO += ELEMENTS,
            templateUrl: 'upload-status.html',
            replace: true,
            scope: {
                flow: '=?',
                game: '=?'
            },
            link: function(scope, element, attrs) {
                scope.isDefined = angular.isDefined;
                scope.GAME_STATUSES = GAME_STATUSES;

                console.log(scope.isDefined(scope.game.status));
                console.log(scope.game.status === null);
                console.log(scope.game.isRegular());
                console.log(scope.game.isNonRegular());
            }
        };

        return uploadStatus;
    }
]);
