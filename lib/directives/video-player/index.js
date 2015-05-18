/* Constants */
let TO = '';
const ELEMENTS = 'E';
const ATTRIBUTES = 'A';

/* Component Dependencies */
require('video-player-seeking-controls');
require('button-video-fast-forward');
require('button-video-fast-backward');
require('button-video-slow-forward');
require('button-video-slow-backward');
require('button-video-step-forward');
require('button-video-step-backward');

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template */
var template = require('./template.html');

/* Dependencies */
var VideoPlayerController = require('./controller');

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
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.poster',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.buffering',
    'com.2fdevs.videogular.plugins.overlayplay'
]);

/* Cache the template file */
VideoPlayer.run([
    '$templateCache',
    function run($templateCache) {

        /* Videogular templates */
        $templateCache.put('vg-templates/vg-overlay-play', require('./overlay-play.html'));
        $templateCache.put('vg-templates/vg-play-pause-button', require('./play-pause-button.html'));
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
videoPlayer.$inject = [
    '$document',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS'
];

/**
 * VideoPlayer directive.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {directive}
 */
function videoPlayer (
    $document,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
) {

    let scrubber;
    let scrubberScope;

    var definition = {

        restrict: TO += ELEMENTS,

        template: template,

        scope: {
            sources: '=',
            posterImage: '='
        },

        bindToController: true,

        controller: VideoPlayerController,

        controllerAs: 'videoPlayer',

        link: link
    };

    function link($scope, element, attributes) {

        $document.ready(() => {

            scrubber = element.find('vg-scrub-bar');
            scrubberScope = scrubber.scope();

            // Unbind mouseleave handlers
            scrubber.unbind('mouseleave', scrubberScope.onScrubBarMouseLeave);
            delete scrubberScope.onScrubBarMouseLeave;

            // Override mousedown handlers
            scrubber.unbind('mousedown', scrubberScope.onScrubBarMouseDown);
            scrubber.bind('mousedown', onScrubBarMouseDown);

            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.FULLSCREEN, function(isFullScreen){
                //Get the indexing block element
                let indexingElement = document.getElementsByClassName('indexing-block')[0];

                if(indexingElement) {
                    //Depending on full screen or not, find the element to prepend to
                    let parentElement = (isFullScreen) ? document.querySelector('videogular') :
                                                        document.getElementsByClassName('content-full')[0];

                    //Prepend indexing block into parent element
                    parentElement.insertBefore( indexingElement, parentElement.firstChild );

                    //Toggle fullscreen class
                    if(indexingElement){
                        indexingElement.classList.toggle('fullscreen', isFullScreen);
                    }
                }
            });



        });
    }


    function onScrubBarMouseDown(event) {

        // Re-assign mouse event handlers to document
        scrubber.unbind('mousemove', scrubberScope.onScrubBarMouseMove);
        $document.bind('mousemove', onScrubBarMouseMove);

        scrubber.unbind('mouseup', scrubberScope.onScrubBarMouseUp);
        $document.bind('mouseup', onScrubBarMouseUp);

        // Invoke original event handler
        scrubberScope.onScrubBarMouseDown(event);
    }

    function onScrubBarMouseMove(event) {

        // Scrubber dimensions and positioning
        let elementRect = scrubber[0].getBoundingClientRect();
        // Videogular controller
        let API = scrubberScope.API;
        // Minimum x positioning for scrubbing
        let xMin = elementRect.left;
        // Maximum x positioning for scrubbing
        let xMax = xMin + elementRect.width;
        // Offset of event.x in px from xMin,  [0, elementRect.width]
        let relativeOffset;
        // % distance offset from scrubber, [0, 1]
        let seekingMultiplier;
        // Time to seek to, [0, ...]
        let time;

        /**
         * Event.clientX is the mouse x position
         * relative to the document
         */
        if (event.clientX <= xMin) {

            relativeOffset = 0;
        }
        else if (event.clientX >= xMax) {

            relativeOffset = elementRect.width;
        }
        else {

            relativeOffset = event.clientX - xMin;
        }

        seekingMultiplier = relativeOffset / elementRect.width;
        time = seekingMultiplier * API.mediaElement[0].duration;

        API.seekTime(time);
        scrubberScope.$apply();
    }

    function onScrubBarMouseUp(event) {

        // Revert mouse event handlers to scrubber
        $document.unbind('mousemove', onScrubBarMouseMove);
        scrubber.bind('mousemove', scrubberScope.onScrubBarMouseMove);

        $document.unbind('mouseup', onScrubBarMouseUp);
        scrubber.bind('mouseup', scrubberScope.onScrubBarMouseUp);

        // Invoke original event handler
        scrubberScope.onScrubBarMouseUp(event);
    }

    return definition;
}

VideoPlayer.directive('videoPlayer', videoPlayer);
