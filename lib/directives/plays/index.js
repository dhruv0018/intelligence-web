/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'plays.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Plays
 * @module Plays
 */
var Plays = angular.module('Plays', [
    'Play',
    'ui.bootstrap'
]);

/* Cache the template file */
Plays.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Plays directive.
 * @module Plays
 * @name Plays
 * @type {directive}
 */
Plays.directive('krossoverPlays', [
    function directive() {

        var Plays = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                game: '=',
                plays: '=',
                league: '=',
                reels: '=',
                videoplayer: '=',
                expandAll: '=',
                reverseOrder: '=?',
                filteredPlaysIds: '=',
                autoAdvance: '=?'
            },

            controller: 'Plays.controller',

            templateUrl: templateUrl
        };

        return Plays;
    }
]);

/**
* Plays controller
*/
Plays.controller('Plays.controller', [
    '$scope',
    function controller($scope) {

        $scope.game.currentPeriod = $scope.game.currentPeriod || 0;
        $scope.game.teamIndexedScore = $scope.game.teamIndexedScore || 0;
        $scope.game.opposingIndexedScore = $scope.game.opposingIndexedScore || 0;

        $scope.orderBy = $scope.reverseOrder ? '-startTime' : 'startTime';
    }
]);
