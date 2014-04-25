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
    'Play'
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
                videoplayer: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Plays;
    }
]);

