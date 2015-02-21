/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Template */
var template = require('./template.html');

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

VideoPlayer.value('VideoPlayer', {});

/**
 * VideoPlayer directive.
 * @module Videoplayer
 * @name VideoPlayer
 * @type {Directive}
 */
VideoPlayer.directive('videoPlayer', [
    function() {

        var directive = {
            scope: {
                sources: '=',
                posterImage: '='
            },
            restrict: TO += ELEMENTS,
            controller: 'VideoPlayer.controller',
            template: template
        };

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
    '$rootScope', '$scope', 'VideoPlayer', 'EventEmitter', 'DEVICE',
    function controller($rootScope, $scope, videoPlayer, emitter, DEVICE) {

        $scope.volume = 1;
        $scope.state = null;

        $scope.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

        $scope.config = {
            autohide: true,
            autoplay: false
        };

        $scope.onPlayerReady = function(API) {

            angular.extend(videoPlayer, API);

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

        $scope.onUpdateVolume = function(volume) {

            $scope.volume = volume;
        };
    }
]);

