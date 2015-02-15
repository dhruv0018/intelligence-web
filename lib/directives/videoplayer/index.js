/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

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
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
]);

/* Cache the template file */
Videoplayer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('videoplayer.html', require('./template.html'));

        /* Custom controls templates. */
        $templateCache.put('krossover-jump-forward-button.html', require('./krossover-jump-forward-button.html'));
        $templateCache.put('krossover-fast-forward-button.html', require('./krossover-fast-forward-button.html'));
        $templateCache.put('krossover-jump-backward-button.html', require('./krossover-jump-backward-button.html'));
        $templateCache.put('krossover-fast-backward-button.html', require('./krossover-fast-backward-button.html'));

        /* Videogular templates */
        $templateCache.put('vg-templates/vg-play-pause-button', require('./krossover-play-pause-button.html'));
    }
]);

Videoplayer.constant('VG_CONFIG', {
    MIN_PARENT_HEIGHT: 50, // min height for parent of video player to be used for determining videos height
    ASPECT_RATIO: 16 / 9,
    CONTROLS_HEIGHT: 60, //Not loaded at this point, so need to hardcode
});

/* TODO: Remove VG_EVENTS constant. No longer needed, but relied on. */
Videoplayer.constant('VG_EVENTS', {
    ON_PLAY: 'onVgPlay',
    ON_PAUSE: 'onVgPause',
    ON_PLAY_PAUSE: 'onVgPlayPause',
    ON_START_PLAYING: 'onVgStartPlaying',
    ON_COMPLETE: 'onVgComplete',
    ON_SET_STATE: 'onVgSetState',
    ON_SET_VOLUME: 'onVgSetVolume',
    ON_TOGGLE_FULLSCREEN: 'onVgToggleFullscreen',
    ON_ENTER_FULLSCREEN: 'onVgEnterFullscreen',
    ON_EXIT_FULLSCREEN: 'onVgExitFullscreen',
    ON_BUFFERING: 'onVgBuffering',
    ON_UPDATE_TIME: 'onVgUpdateTime',
    ON_SEEK_TIME: 'onVgSeekTime',
    ON_UPDATE_SIZE: 'onVgUpdateSize',
    ON_PLAYER_READY: 'onVgPlayerReady',
    ON_LOAD_POSTER: 'onVgLoadPoster',
    ON_ERROR: 'onVgError'
});

Videoplayer.value('Videoplayer', {});

Videoplayer.factory('VideoPlayerInstance', [
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
                sources: '='
            },
            restrict: TO += ELEMENTS,
            link: link,
            controller: 'Videoplayer.controller',
            templateUrl: 'videoplayer.html'
        };

        function link($scope, element, attributes) {
        }

        return directive;
    }
]);

/**
 * Videoplayer controller.
 * @module Videoplayer
 * @name Videoplayer.controller
 * @type {controller}
 */
Videoplayer.controller('Videoplayer.controller', [
    '$window', '$rootScope', 'config', '$scope', '$state', '$sce', '$modal', 'vgFullscreen', 'Videoplayer', 'VideoPlayerInstance', 'PlayManager', 'EventManager', 'VG_CONFIG', 'VG_STATES', 'DEVICE',
    function controller($window, $rootScope, config, $scope, $state, $sce, $modal, vgFullscreen, videoplayer, videoPlayerInstance, playManager, eventManager, VG_CONFIG, VG_STATES, DEVICE) {

        var videoPlayer = videoPlayerInstance.promise;

        var currentClipTime = 0;
        var self = this;

        $scope.state = null;
        $scope.volume = 1;
        $scope.VG_STATES = VG_STATES;
        $scope.playManager = playManager;

        $scope.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

        $scope.config = {
            autoHide: false,
            autoPlay: false,
            responsive: true,
            transclude: false
        };

        /* Add event listeners. */
        $scope.$on('$destroy', onDestroy);
        window.addEventListener('resize', onWindowResize);
        document.addEventListener(vgFullscreen.onchange, onFullScreenChange);

        /**
         * Element on destroy event listener.
         */
        function onDestroy() {

            /* Remove event listeners.*/
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener(vgFullscreen.onchange, onFullScreenChange);
        }

        /**
         * Window on resize event listener.
         */
        function onWindowResize() {

            /* If the video is not in fullscreen. */
            if (!vgFullscreen.isFullScreen()) {

                /* Fix the video on screen. */
                fitVideo(videoplayer.videogularElement, videoplayer.mediaElement);
            }
        }

        /**
         * Videogular on fullscreen change event listener.
         */
        function onFullScreenChange() {

            /* If the video is in fullscreen. */
            if (vgFullscreen.isFullScreen()) {

                /* Show the video fullscreen. */
                fullScreenVideo(videoplayer.videogularElement, videoplayer.mediaElement);
            }

            /* If the video is not in fullscreen. */
            else {

                /* Fit the video on screen. */
                fitVideo(videoplayer.videogularElement, videoplayer.mediaElement);
            }
        }

        function fullScreenVideo(videogularElement, mediaElement) {

            videogularElement[0].style.removeProperty('width');
            videogularElement[0].style.removeProperty('height');
            mediaElement[0].style.removeProperty('width');
            mediaElement[0].style.removeProperty('height');
            mediaElement[0].style.removeProperty('max-width');
            mediaElement[0].style.removeProperty('max-height');
        }

        function fitVideo(videogularElement, mediaElement) {

            // Aspect ratio is calculated before adding the height required for the controls
            var videoRect = videogularElement.parent()[0].getBoundingClientRect();
            var currentVideoWidth = videoRect.width;
            var currentVideoHeight = videoRect.height;

            var parentWithHeight = getParentWithHeight(videogularElement);

            if (!parentWithHeight) {
                return; // Don't resize as the window height is too small
            } else {
                // 1) The video player should always remain entirely within the window
                // 2) The video player should be as wide as possible
                // 3) The video player should have an aspect ratio of 16:9
                // 4) The video player should be contained within it's container

                /* The player height must include room for the player-controls
                * but the aspect ratio must not include the height of the controls.
                */

                // Get a parent that does not have a significantly small height
                var parentWithHeightRect = parentWithHeight[0].getBoundingClientRect();

                // Set the width to the parent container width
                properWidth = parentWithHeightRect.width;

                // Get height with proper aspect-ratio
                var properVideoHeight = properWidth * (1 / VG_CONFIG.ASPECT_RATIO);
                var properPlayerHeight = properVideoHeight + VG_CONFIG.CONTROLS_HEIGHT;

                // Get the parent's height and width
                var parentHeight = parentWithHeightRect.height;
                var parentWidth = parentWithHeightRect.width;

                /* Check if the height is within the parent container and
                * only fit the player within the parent's height if on desktop */
                if ($rootScope.viewport.name === 'Desktop' && properPlayerHeight > parentHeight) {
                    // Reset the properHeight and proper Width to fit within the parent
                    properPlayerHeight = parentHeight;
                    properVideoHeight = properPlayerHeight - VG_CONFIG.CONTROLS_HEIGHT;
                    properWidth = properVideoHeight * VG_CONFIG.ASPECT_RATIO;
                }

                videogularElement.css('width', properWidth + 'px');
                videogularElement.css('height', properPlayerHeight + 'px');
                mediaElement.css('max-width', properWidth + 'px');
                mediaElement.css('max-height', properPlayerHeight + 'px');
            }
        }

        function getParentWithHeight(elem) {
            if (!elem) return null;

            var parent = elem.parent();

            if (!parent || !parent[0]) return null;

            var height = parent[0].getBoundingClientRect().height;
            if (height > VG_CONFIG.MIN_PARENT_HEIGHT) {
                return parent;
            } else {
                return getParentWithHeight(parent);
            }
        }

        $scope.onPlayerReady = function(API) {

            self.API = API;
            angular.extend(videoplayer, API);
            API.mediaElement.one('canplay', function() {
                videoPlayerInstance.resolve(API);
            });

            //Run once to have the correct size on load
            fitVideo(API.videogularElement, API.mediaElement);
        };

        $scope.onCompleteVideo = function() {

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

