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
    'ROLES', '$state', 'SessionService',
    function directive(ROLES, $state, session) {

        var uploadingControls = {

            restrict: TO += ELEMENTS,
            templateUrl: 'uploadingControls.html',
            replace: true,
            scope: {
                flow: '=?'
            },
            link: function(scope, element, attrs) {
                console.log('working upload controls');
            }
        };

        return uploadingControls;
    }
]);
