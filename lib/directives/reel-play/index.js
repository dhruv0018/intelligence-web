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
                $index: '=index',
                play: '=',
                team: '=',
                opposingTeam: '=',
                datePlayed: '=',
                editFlag: '=',
                removeReelPlay: '&'
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
    '$scope', '$sce', 'VideoElement',
    function($scope, $sce, videoPlayerElement) {

        $scope.playPlay = function() {
            var sources = [];
            var profile;

            for (profile in $scope.play.clip.videoTranscodeProfiles) {
                if ($scope.play.clip.videoTranscodeProfiles[profile].videoUrl) {

                    var source = {
                        type: 'video/mp4',
                        src: $sce.trustAsResourceUrl($scope.play.clip.videoTranscodeProfiles[profile].videoUrl)
                    };

                    sources.push(source);
                }
            }

            videoPlayerElement.setSources(sources);
        };
    }
]);
