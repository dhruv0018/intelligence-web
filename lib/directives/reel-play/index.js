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
    '$scope', 'VideoElement', 'VideoPlayerInstance', 'PlayManager', 'VG_STATES',
    function($scope, videoPlayerElement, videoPlayerInstance, playManager, VG_STATES) {

        var videoPlayer = videoPlayerInstance.promise;
        $scope.playManager = playManager;
        $scope.VG_STATES = VG_STATES;

        $scope.playPlay = function(autoPlayVideo) {
            var sources = [];
            autoPlayVideo = (typeof autoPlayVideo === 'undefined') ? true : autoPlayVideo;

            videoPlayerElement.setSources($scope.play.getVideoSources());

            if (autoPlayVideo) {
                videoPlayer.then(function(vp) {
                    vp.play();
                });
            }

            playManager.current = $scope.play;
        };

        //Automatically queue up the first reel play in the video player on page load
        if ($scope.$index === 0 && !videoPlayerElement.get().src) {
            $scope.playPlay(false);
        }
    }
]);
