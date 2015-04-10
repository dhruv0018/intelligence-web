/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');
const templateUrl = 'button-video-slow-backward.html';

/**
 * ButtonVideoSlowBackward
 * @module ButtonVideoSlowBackward
 */
let ButtonVideoSlowBackward = angular.module('ButtonVideoSlowBackward', []);

/* Cache the template file */
ButtonVideoSlowBackward.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * ButtonVideoSlowBackward directive.
 * @module Videoplayer
 * @name ButtonVideoSlowBackward
 * @type {directive}
 */
ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', [
    'VG_STATES',
    function directive(VG_STATES) {

        let mediaElement;
        let videogular;
        let isSeeking = false;
        let slowBackwardSeekFrame;
        let seekTime;
        let stepTime;

        const definition = {

            restrict: TO += ELEMENTS,

            require: '^videogular',

            templateUrl: templateUrl,

            link: link
        };

        function link($scope, element, attributes, controller) {

            videogular = controller;
            mediaElement = videogular.mediaElement[0];

            let slowBackwardButton = element[0];

            slowBackwardButton.addEventListener('mouseup', onMouseUp);
            slowBackwardButton.addEventListener('mousedown', onMouseDown);
            element.on('$destroy', onDestroy);
        }

        function onMouseUp () {

            normalizePlayback();
        }

        function onMouseDown () {

            slowBackwardPlayback();
        }

        function normalizePlayback () {

            isSeeking = false;
            cancelAnimationFrame(slowBackwardSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function slowBackwardPlayback () {

            isSeeking = true;
            mediaElement.playbackRate = -2.0;
            seekTime = mediaElement.currentTime;
            stepTime = 0.08;
            slowBackwardSeekFrame = requestAnimationFrame(slowBackwardSeek);
        }

        function slowBackwardSeek () {

            if (!isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            slowBackwardSeekFrame = requestAnimationFrame(slowBackwardSeek);
        }

        function onDestroy () {

            normalizePlayback();
            slowBackwardButton.removeEventListener('mouseup', onMouseUp);
            slowBackwardButton.removeEventListener('mousedown', onMouseDown);
        }

        return definition;
    }
]);
