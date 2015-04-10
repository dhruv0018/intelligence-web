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
 * VideoPlayer directive.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {directive}
 */
VideoPlayer.directive('videoPlayer', [
    '$document',
    function directive($document) {

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

                let scrubber = element.find('vg-scrub-bar');
                let volume = element.find('vg-volume');

                scrubber.unbind('mouseleave', scrubber.scope().onScrubBarMouseLeave);
                delete scrubber.scope().onScrubBarMouseLeave;

                scrubber.unbind('touchleave', scrubber.scope().onScrubBarTouchLeave);
                delete scrubber.scope().onScrubBarTouchLeave;
                
                volume.unbind('mouseleave', volume.scope().onMouseLeaveVolume);
                delete volume.scope().onMouseLeaveVolume;
            });
        }

        return definition;
    }
]);
