/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component Dependencies */
require('button-video-forward');
require('button-video-backward');

/* Fetch angular from the browser scope */
var angular = window.angular;

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
    'ButtonVideoForward',
    'ButtonVideoBackward',
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
    '$document'
];

/**
 * VideoPlayer directive.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {directive}
 */
function videoPlayer (
    $document
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
        let element = scrubber[0].getBoundingClientRect();
        // Videogular controller
        let API = scrubberScope.API;
        // Minimum x positioning for scrubbing
        let xMin = element.left;
        // Maximum x positioning for scrubbing
        let xMax = xMin + element.width;
        // Offset of event.x relative to scrubber,  [0, element.width]
        let elementOffset;
        // % distance offset from scrubber, [0, 1]
        let relativeOffset;
        // Time to seek to, [0, ...]
        let time;

        /**
         * Event.clientX is the mouse x position
         * relative to the document
         */
        if (event.clientX <= xMin) {

            elementOffset = 0;
        }
        else if (event.clientX >= xMax) {

            elementOffset = element.width;
        }
        else {

            elementOffset = event.clientX - xMin;
        }

        relativeOffset = elementOffset / element.width;
        time = relativeOffset * API.mediaElement[0].duration;

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
