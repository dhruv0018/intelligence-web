/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Videoplayer module.
 * @module Videoplayer
 */
var Videoplayer = angular.module('videoplayer', [
    'ui.router',
    'ui.bootstrap',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.buffering',
    'com.2fdevs.videogular.plugins.poster',
]);

/* Cache the template file */
Videoplayer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('videoplayer.html', require('./template.html'));
        $templateCache.put('krossover-play-pause-button.html', require('./krossover-play-pause-button.html'));
        $templateCache.put('krossover-jump-forward-button.html', require('./krossover-jump-forward-button.html'));
        $templateCache.put('krossover-fast-forward-button.html', require('./krossover-fast-forward-button.html'));
        $templateCache.put('krossover-jump-backward-button.html', require('./krossover-jump-backward-button.html'));
        $templateCache.put('krossover-fast-backward-button.html', require('./krossover-fast-backward-button.html'));
        $templateCache.put('krossover-full-screen-button.html', require('./krossover-full-screen-button.html'));
        $templateCache.put('krossover-mute-button.html', require('./krossover-mute-button.html'));

        /* Videogular template files */
        $templateCache.put('views/videogular/plugins/buffering/buffering.html', require('./buffering.html'));
        $templateCache.put('views/videogular/plugins/controls/volume-bar.html', require('./volume-bar.html'));
        $templateCache.put('views/videogular/plugins/controls/controls.html', require('./controls.html'));
    }
]);

Videoplayer.factory('VideoPlayerInstance', [
    '$q',
    function($q) {
        this.deferred = this.deferred || $q.defer();

        return {
            then: this.deferred.promise.then,
            resolve: this.deferred.resolve
        };
    }
]);

/**
 * Videoplayer directive.
 * @module Videoplayer
 * @name KrossoverVideoplayer
 * @type {Directive}
 */
Videoplayer.directive('krossoverVideoplayer', [
    '$sce',
    function($sce) {

        var directive = {
            scope: {
                sources: '=',
                playStartTime: '=',
                playEndTime: '='
            },
            restrict: TO += ELEMENTS,
            link: link,
            controller: 'krossoverVideoplayer.controller',
            templateUrl: 'videoplayer.html'
        };

        function link($scope, element, attributes) {
        }

        return directive;
    }
]);

Videoplayer.controller('krossoverVideoplayer.controller', [
    '$scope', '$state', '$sce', '$modal', 'VideoPlayerInstance', 'PlayManager', 'EventManager',
    function($scope, $state, $sce, $modal, videoPlayer, play, event) {

        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;

        $scope.clipStartTime = $scope.playStartTime;


        function updateMediaFragment(newClipTime) {

            if (newClipTime) {
                $scope.mediaFragmentURI = '#t=' + $scope.clipStartTime + ',' + $scope.playEndTime;
            } else {
                $scope.mediaFragmentURI = '';
            }

            videoPlayer.then(function(vp) {
                vp.videoElement[0].src = vp.videoElement[0].children[0].src.split('#')[0] + $scope.mediaFragmentURI;
            });
        }

        $scope.$watch('clipStartTime', updateMediaFragment);
        $scope.$watch('clipEndTime', updateMediaFragment);

        $scope.$watch(function() { return (event && event.current && event.current.time) ? event.current.time : 0; }, function(newClipTime) {
            $scope.clipStartTime = newClipTime;
        });

        $scope.buildSrcUri = function(source) {

            var uri = source.src + $scope.mediaFragmentURI;

            return $sce.trustAsResourceUri(uri);
        };

        $scope.onPlayerReady = function(API) {
            API.videoElement.one('canplay', function() {
                videoPlayer.resolve(API);
            });
        };

        $scope.onCompleteVideo = function() {

            $scope.isCompleted = true;
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
        };

        $scope.onUpdateTime = function(currentTime, endTime) {

            $scope.currentClipTime = currentTime;
            if ($scope.playEndTime && currentTime > $scope.playEndTime) {
                videoPlayer.then(function(vp) {
                    vp.pause();
                    vp.seekTime($scope.playEndTime);
                });
            } else if ($scope.playStartTime && currentTime < $scope.playStartTime) {
                videoPlayer.then(function(vp) {
                    vp.seekTime($scope.playStartTime);
                });
            }
            $scope.$apply();
        };

        $scope.onUpdateVolume = function(volume) {

            $scope.volume = volume;
        };

        $scope.onUpdateSize = function(width, height) {

            $scope.config.width = width;
            $scope.config.height = height;
        };

        $scope.stretchModes = [

            { label: 'None', value: 'none' },
            { label: 'Fit',  value: 'fit' },
            { label: 'Fill', value: 'fill' }
        ];

        $scope.config = {

            width: 740,
            height: 380,
            autoHide: false,
            autoPlay: false,
            responsive: true,
            transclude: false,
            stretch: $scope.stretchModes[2],
            theme: {
                url: 'styles.css'
            }
        };

        $scope.onClickPlayPause = function onClickPlayPause() {
            /* Set the play rate to play normal. */
            videoPlayer.then(function(vp) {
                vp.videoElement[0].playbackRate = 1.0;
                vp.playPause();
            });
        };

        $scope.onClickFastBackward = function onClickFastBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime($scope.currentClipTime - 3);
                vp.videoElement[0].playbackRate = 1;
                event.highlighted = null;
                //vp.videoElement[0].playbackRate = (vp.videoElement[0].playbackRate > 0 && vp.videoElement[0].playbackRate !== 1) ? 1 : -3.0;
            });
        };

        $scope.onClickFastForward = function onClickFastForward() {
            videoPlayer.then(function(vp) {
                vp.videoElement[0].playbackRate = (vp.videoElement[0].playbackRate !== 1) ? 1 : 3.0;
            });
        };

        $scope.onClickJumpBackward = function onClickJumpBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime($scope.currentClipTime - 1);
                vp.videoElement[0].playbackRate = 1;
                event.highlighted = null;
                //vp.videoElement[0].playbackRate = (vp.videoElement[0].playbackRate > 0 && vp.videoElement[0].playbackRate !== 1) ? 1 : -0.25;
            });
        };

        $scope.onClickJumpForward = function onClickJumpForward() {
            videoPlayer.then(function(vp) {
                vp.videoElement[0].playbackRate = (vp.videoElement[0].playbackRate !== 1) ? 1 : 0.25;
            });
        };
    }
]);

