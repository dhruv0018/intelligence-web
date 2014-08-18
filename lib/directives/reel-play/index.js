/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ReelPlay
 * @module ReelPlay
 */
var ReelPlay = angular.module('ReelPlay', []);

/* Cache the template file */
ReelPlay.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('reel-play.html', template);
    }
]);

/**
 * ReelPlay directive.
 * @module ReelPlay
 * @name ReelPlay
 * @type {Directive}
 */
ReelPlay.directive('krossoverReelPlay', [
    function directive() {

        function link($scope, elem, attr) {
            console.log($scope);
        }

        var reelPlay = {

            scope: {
                playId: '=',
                homeTeam: '=',
                opposingTeam: '=',
                datePlayed: '='
            },

            restrict: TO += ELEMENTS,

            templateUrl: 'reel-play.html',

            link: link
        };

        return reelPlay;
    }
]);

