/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'playlist-control.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlaylistControl
 * @module PlaylistControl
 */
var PlaylistControl = angular.module('PlaylistControl', [
    'ui.bootstrap'
]);

/* Cache the template file */
PlaylistControl.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlaylistControl directive.
 * @module PlaylistControl
 * @name PlaylistControl
 * @type {directive}
 */
PlaylistControl.directive('krossoverPlaylistControl', [
    function directive() {

        var PlaylistControl = {

            restrict: TO += ELEMENTS,

            replace: true,

            controller: 'PlaylistControl.controller',

            templateUrl: templateUrl,

        };

        return PlaylistControl;
    }
]);

/**
* PlaylistControl controller
*/
PlaylistControl.controller('PlaylistControl.controller', [
    '$scope', 'PlayManager',
    function controller($scope, playManager) {
        $scope.playManager = playManager;
    }
]);
