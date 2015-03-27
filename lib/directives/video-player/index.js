/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component Dependencies */
require('button-video-forward');
require('button-video-backward');
require('cuepoints');

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
    'ButtonVideoForward',
    'ButtonVideoBackward',
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
    function directive() {

        var definition = {
            restrict: TO += ELEMENTS,
            template: template,
            scope: {
                sources: '=',
                posterImage: '=',
                cuePoints: '='
            },
            bindToController: true,
            controller: VideoPlayerController,
            controllerAs: 'videoPlayer'
        };

        return definition;
    }
]);
