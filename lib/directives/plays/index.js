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
                plays: '=',
                team: '=',
                opposingTeam: '=',
                league: '=',
                videoplayer: '=',
                expandAll: '='
            },

            link: link,

            controller: 'Plays.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Plays;
    }
]);

/**
* Plays controller
*/
Plays.controller('Plays.controller', [
    '$scope', 'SessionService', 'ROLES',
    function controller($scope, session, ROLES) {

        $scope.INDEXER = ROLES.INDEXER;

        $scope.currentUser = session.currentUser;

    }
]);
