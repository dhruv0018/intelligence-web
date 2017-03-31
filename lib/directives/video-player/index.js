/* Constants */
let TO = '';
const ELEMENTS = 'E';
const ATTRIBUTES = 'A';

import controller from './controller';

import OverlayPlayTemplate from './overlay-play.html';
import PlayPauseButton from './play-pause-button.html';

import ButtonVideoFastBackward from './button-video-fast-backward';
import ButtonVideoFastForward from './button-video-fast-forward';
import ButtonVideoNextPlay from './button-video-next-play';
import ButtonVideoPreviousPlay from './button-video-previous-play';
import ButtonVideoSlowBackward from './button-video-slow-backward';
import ButtonVideoSlowForward from './button-video-slow-forward';
import ButtonVideoStepBackward from './button-video-step-backward';
import ButtonVideoStepForward from './button-video-step-forward';
import CuePoints from './cuepoints';
import SelectMediaSrc from './select-media-src';
import VideoPlayerSeekingControls from './video-player-seeking-controls';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * VideoPlayer module.
 * @module VideoPlayer
 */
var VideoPlayer = angular.module('VideoPlayer', [
    'ui.router',
    'ui.bootstrap',
    'VideoPlayerSeekingControls',
    'ButtonVideoFastForward',
    'ButtonVideoFastBackward',
    'ButtonVideoSlowForward',
    'ButtonVideoSlowBackward',
    'ButtonVideoStepForward',
    'ButtonVideoStepBackward',
    'ButtonVideoNextPlay',
    'ButtonVideoPreviousPlay',
    'SelectMediaSrc',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.poster',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.buffering',
    'com.2fdevs.videogular.plugins.overlayplay',
    'CuePoints'
]);

/* Cache the template file */
VideoPlayer.run([
    '$templateCache',
    function run($templateCache) {

        /* Videogular templates */
        $templateCache.put('vg-templates/vg-overlay-play', OverlayPlayTemplate);
        $templateCache.put('vg-templates/vg-play-pause-button', PlayPauseButton);
    }
]);

/**
 * VideoPlayer value.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {value}
 */
VideoPlayer.value('VideoPlayer', {});

/**
 * VideoPlayer dependencies
 */

VideoPlayerDirective.$inject = [
    '$rootScope',
    '$document',
    '$window',
    'VideoPlayer',
    'VIDEO_PLAYER_CONFIG',
    'vgFullscreen',
    'VIEWPORTS',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter'
];

/**
 * VideoPlayer directive.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {directive}
 */

function VideoPlayerDirective (
    $rootScope,
    $document,
    $window,
    videoPlayer,
    VIDEO_PLAYER_CONFIG,
    vgFullscreen,
    VIEWPORTS,
    VIDEO_PLAYER_EVENTS,
    VideoPlayerEventEmitter

) {

    var definition = {

        restrict: TO += ELEMENTS,

        templateUrl: 'lib/directives/video-player/template.html',

        transclude: true,

        scope: {
            video: '=',
            posterImage: '=',
            cuePoints: '=?',
            telestrations: '=?',
            playId: '=?',
            telestrationsPermissions: '=?',
            selfEditingMode: '=?',
            reelHasNoBasketballPlays: '=?'
        },

        bindToController: true,

        controller,

        controllerAs: 'videoPlayer',

        link: link
    };

    function link($scope, element, attributes) {

        $document.ready(() => {

            let vgMediaContainer = angular.element(document.getElementsByClassName('vg-media-container')[0]);

            function fitVideo(videogularElement, mediaElement) {

                if (vgFullscreen.isFullScreen && vgFullscreen.isFullScreen() && document.fullscreenElement === videogularElement[0]) {

                    let fullscreenGutterWidth = VIDEO_PLAYER_CONFIG.CONTROLS_HEIGHT * VIDEO_PLAYER_CONFIG.ASPECT_RATIO;
                    vgMediaContainer.css('width', 'calc(100% - ' + fullscreenGutterWidth + 'px)');

                    let vgMediaContainerWidth = vgMediaContainer[0].getBoundingClientRect().width;
                    vgMediaContainer.css('height', vgMediaContainerWidth * 1 / VIDEO_PLAYER_CONFIG.ASPECT_RATIO + 'px');

                } else {

                    // reset vgMediaContainer
                    vgMediaContainer.css({
                        'width': 'auto',
                        'height': 'auto'
                    });

                    // Aspect ratio is calculated before adding the height required for the controls
                    let videoRect = videogularElement.parent()[0].getBoundingClientRect();
                    let currentVideoWidth = videoRect.width;
                    let currentVideoHeight = videoRect.height;

                    let parentWithHeight = getJQLiteParentWithHeight(videogularElement);

                    if (!parentWithHeight) return;


                    // 1) The video player should always remain entirely within the window
                    // 2) The video player should be as wide as possible
                    // 3) The video player should have an aspect ratio of 16:9
                    // 4) The video player should be contained within it's container

                    /* The player height must include room for the player-controls
                    * but the aspect ratio must not include the height of the controls.
                    */

                    // Get a parent that does not have a significantly small height
                    let parentWithHeightRect = parentWithHeight[0].getBoundingClientRect();

                    // Set the width to the parent container width
                    let properWidth = parentWithHeightRect.width;

                    // Get height with proper aspect-ratio
                    let properVideoHeight = properWidth * (1 / VIDEO_PLAYER_CONFIG.ASPECT_RATIO);
                    let properPlayerHeight = properVideoHeight + VIDEO_PLAYER_CONFIG.CONTROLS_HEIGHT;

                    // Get the parent's height and width
                    let parentHeight = parentWithHeightRect.height;
                    let parentWidth = parentWithHeightRect.width;

                    /* Check if the height is within the parent container and
                    * only fit the player within the parent's height if on desktop */
                    if ($rootScope.viewport.name === VIEWPORTS.DESKTOP.name && properPlayerHeight > parentHeight) {

                        // Reset the properHeight and proper Width to fit within the parent
                        properPlayerHeight = parentHeight;
                        properVideoHeight = properPlayerHeight - VIDEO_PLAYER_CONFIG.CONTROLS_HEIGHT;
                        properWidth = properVideoHeight * VIDEO_PLAYER_CONFIG.ASPECT_RATIO;
                    }

                    videogularElement.css('width', properWidth + 'px');
                    videogularElement.css('height', properPlayerHeight + 'px');
                    mediaElement.css('width', properWidth + 'px');
                    mediaElement.css('height', properVideoHeight + 'px');
                }
            }

            function getJQLiteParentWithHeight(elem) {
                if (!elem) return null;

                let parent = elem.parent();

                if (!parent || !parent[0]) return null;

                let height = parent[0].getBoundingClientRect().height;

                if (height > VIDEO_PLAYER_CONFIG.MIN_PARENT_HEIGHT) {

                    return parent;

                } else {

                    return getJQLiteParentWithHeight(parent);
                }
            }

            // Run once to have the correct size on load
            // TODO: remove these parameters
            fitVideo(videoPlayer.videogularElement, videoPlayer.mediaElement);

            // Resize video when page resizes
            $window.addEventListener('resize', resize);
            VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.RESIZE, resize);

            // Resize video when page changes from fullscreen
            document.addEventListener(vgFullscreen.onchange, resize);

            function resize() {

                fitVideo(videoPlayer.videogularElement, videoPlayer.mediaElement);
            }


            /* Cleanup */

            $scope.$on('$destroy', function onVideoPlayerDestroy() {

                $window.removeEventListener('resize', resize);
                document.removeEventListener(vgFullscreen.onchange, resize);

            });
        });
    }

    return definition;
}

VideoPlayer.directive('videoPlayer', VideoPlayerDirective);

export default VideoPlayer;
