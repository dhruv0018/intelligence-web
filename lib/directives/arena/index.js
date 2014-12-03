/* Component dependencies */
require('football-field');
require('basketball-hs-arena');
require('basketball-ncaa-arena');
require('basketball-nba-arena');
require('basketball-fiba-arena');
require('lacrosse-mens-outdoor-arena');
require('lacrosse-womens-outdoor-arena');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena
 * @module Arena
 */
var Arena = angular.module('Arena', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Football.FootballField',
    'Arena.Basketball.HighSchool',
    'Arena.Basketball.NCAA',
    'Arena.Basketball.NBA',
    'Arena.Basketball.FIBA',
    'Arena.Lacrosse.MensOutdoor',
    'Arena.Lacrosse.WomensOutdoor'
]);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverArena', [
    function directive() {

        var Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                type: '=',
                game: '=?',
                plays: '=?',
                teamId: '=?',
                opposingTeamId: '=?',
                teamPlayers: '=',
                opposingTeamPlayers: '=?',
                league: '=?',
                chart: '=?',
                redzone: '=?'
            },

            link: link,
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Arena;
    }
]);

