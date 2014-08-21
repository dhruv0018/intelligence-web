/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

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
        }

        var reelPlay = {

            scope: {
                play: '=',
                homeTeam: '=',
                opposingTeam: '=',
                datePlayed: '='
            },

            restrict: TO += ATTRIBUTES + ELEMENTS,

            templateUrl: 'reel-play.html',

            controller: 'ReelPlay.controller',

            link: link
        };

        return reelPlay;
    }
]);

ReelPlay.controller('ReelPlay.controller', [
    '$scope', 'VideoPlayerInstance',
    function($scope, videoPlayer) {

        $scope.playPlay = function() {
        };
    }
]);
