/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * VideoPlayer module.
 * @module VideoPlayer
 */
var VideoPlayer = angular.module('VideoPlayer', [
    'ui.router',
    'ui.bootstrap',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
]);

/* Cache the template file */
VideoPlayer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('video-player.html', require('./template.html'));

        /* Custom controls templates. */
        $templateCache.put('krossover-jump-forward-button.html', require('./krossover-jump-forward-button.html'));
        $templateCache.put('krossover-fast-forward-button.html', require('./krossover-fast-forward-button.html'));
        $templateCache.put('krossover-jump-backward-button.html', require('./krossover-jump-backward-button.html'));
        $templateCache.put('krossover-fast-backward-button.html', require('./krossover-fast-backward-button.html'));

        /* Videogular templates */
        $templateCache.put('vg-templates/vg-play-pause-button', require('./krossover-play-pause-button.html'));
        $templateCache.put('vg-templates/vg-overlay-play', require('./krossover-overlay-play.html'));
    }
]);

VideoPlayer.value('VideoPlayer', {});

VideoPlayer.factory('VideoPlayerInstance', [
    '$q',
    function($q) {
        this.defer = $q.defer();
        var oldReject = this.defer.reject;
        this.defer.reject = function(reason) {
            oldReject(reason);
            this.defer = $q.defer();
        };
        return this.defer;

    }
]);

/**
 * VideoPlayer directive.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {Directive}
 */
VideoPlayer.directive('videoPlayer', [
    'EventEmitter', 'EVENT_MAP',
    function(emitter, EVENT_MAP) {

        var directive = {
            scope: {
                sources: '=',
                posterImage: '='
            },
            restrict: TO += ELEMENTS,
            link: link,
            controller: 'VideoPlayer.controller',
            templateUrl: 'video-player.html'
        };

        function link(scope, element, attributes, controller) {

        }

        return directive;
    }
]);

/**
 * VideoPlayer controller.
 * @module VideoPlayer
 * @name VideoPlayer.controller
 * @type {controller}
 */
VideoPlayer.controller('VideoPlayer.controller', [
    '$rootScope', '$scope', 'vgFullscreen', 'VideoPlayer', 'VideoPlayerInstance', 'EventEmitter', 'VG_STATES', 'DEVICE',
    function controller($rootScope, $scope, vgFullscreen, videoPlayer, videoPlayerInstance, emitter, VG_STATES, DEVICE) {

        var videoPlayer = videoPlayerInstance.promise;

        var currentClipTime = 0;
        var self = this;
        $scope.state = null;
        $scope.volume = 1;
        $scope.VG_STATES = VG_STATES;
        $scope.playManager = playManager;

        $scope.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

        $scope.config = {
            autohide: true,
            autoPlay: false,
            responsive: true,
            transclude: false
        };

        $scope.onPlayerReady = function(API) {

            self.API = API;
            angular.extend(videoPlayer, API);
            API.mediaElement.one('canplay', function() {
                videoPlayerInstance.resolve(API);
            });

            videoPlayer.mediaElement[0].addEventListener('canplay', onCanPlay);
            videoPlayer.mediaElement[0].addEventListener('play', onPlay);
            videoPlayer.mediaElement[0].addEventListener('pause', onPause);
            videoPlayer.mediaElement[0].addEventListener('seeking', onSeeking);
            videoPlayer.mediaElement[0].addEventListener('timeupdate', onTimeUpdate);

            function onCanPlay(event) {

                emitter.register(event);
            }

            function onPlay(event) {

                emitter.register(event);
            }

            function onPause(event) {

                emitter.register(event);
            }

            function onSeeking(event) {

                emitter.register(event);
            }

            function onTimeUpdate(event) {

                emitter.register(event);
            }
        };

        $scope.onCompleteVideo = function() {

            emitter.register(new Event('clip-completion'));
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
        };

        $scope.onChangeSource = function(source) {

            $scope.sources = source;
        };

        $scope.onUpdateTime = function(currentTime, duration) {

        };

        $scope.onUpdateVolume = function(volume) {

            $scope.volume = volume;
        };

        $scope.onClickPlayPause = function onClickPlayPause() {

            /* Set the play rate to play normal. */
            videoPlayer.then(function(vp) {
                vp.mediaElement[0].playbackRate = 1.0;

                if ($scope.isCompleted) {
                    vp.seekTime($scope.playStartTime);
                    vp.play();
                } else {
                    vp.playPause();
                }
            });
        };

        $scope.onClickFastBackward = function onClickFastBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime(currentClipTime - 3);
                vp.mediaElement[0].playbackRate = 1;

                //reset highlighting since jumping backwards
                eventManager.highlighted = null;
            });
        };

        $scope.onClickFastForward = function onClickFastForward() {
            videoPlayer.then(function(vp) {
                vp.mediaElement[0].playbackRate = (vp.mediaElement[0].playbackRate !== 1) ? 1 : 3.0;
            });
        };

        $scope.onClickJumpBackward = function onClickJumpBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime(currentClipTime - 1);
                vp.mediaElement[0].playbackRate = 1;

                //reset highlighting since jumping backwards
                eventManager.highlighted = null;
            });
        };

        $scope.onClickJumpForward = function onClickJumpForward() {
            videoPlayer.then(function(vp) {
                vp.mediaElement[0].playbackRate = (vp.mediaElement[0].playbackRate !== 1) ? 1 : 0.25;
            });
        };
    }
]);

