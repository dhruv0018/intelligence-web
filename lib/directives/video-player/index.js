/* Constants */
var TO = '';
var ELEMENTS = 'E';

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
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
]);

/* Cache the template file */
VideoPlayer.run([
    '$templateCache',
    function run($templateCache) {

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

        var directive = {
            restrict: TO += ELEMENTS,
            scope: {
                sources: '=',
                posterImage: '='
            },
            controller: VideoPlayerController,
            template: template
        };

        return directive;
    }
]);

