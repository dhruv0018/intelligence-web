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
    'ui.bootstrap'
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

            replace: true,

            scope: {
                game: '=',
                plays: '=',
                team: '=',
                league: '=',
                reels: '=',
                opposingTeam: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                videoplayer: '=',
                expandAll: '=',
                reverseOrder: '=?',
                filteredPlaysIds: '=',
                autoAdvance: '=?',
                editMode: '=?',
            },

            controller: 'Playlist.controller',

            templateUrl: templateUrl,

            transclude: true
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

        $scope.game.currentPeriod = $scope.game.currentPeriod || 0;
        $scope.game.teamIndexedScore = $scope.game.teamIndexedScore || 0;
        $scope.game.opposingIndexedScore = $scope.game.opposingIndexedScore || 0;

        $scope.orderBy = $scope.reverseOrder ? '-startTime' : 'startTime';

        $scope.editMode = angular.isDefined($scope.editMode) ? $scope.editMode : false;
    }
]);
