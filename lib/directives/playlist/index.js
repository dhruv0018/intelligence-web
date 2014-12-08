/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'playlist.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Playlist
 * @module Playlist
 */
var Playlist = angular.module('Playlist', [
    'Play',
    'ui.bootstrap',
    'ng'
]);

/* Cache the template file */
Playlist.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Playlist directive.
 * @module Playlist
 * @name Playlist
 * @type {directive}
 */
Playlist.directive('krossoverPlaylist', [
    function directive() {

        var Playlist = {

            restrict: TO += ELEMENTS,

            controller: 'Playlist.controller',

            templateUrl: templateUrl,

            replace: true
        };

        return Playlist;
    }
]);

/**
* Playlist controller
*/
Playlist.controller('Playlist.controller', [
    '$scope', 'PlaysManager',
    function controller($scope, playsManager) {
        playsManager.plays = $scope.plays;
    }
]);
