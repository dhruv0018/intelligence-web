/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');
const templateUrl = 'button-video-slow-forward.html';

/**
 * ButtonVideoSlowForward
 * @module ButtonVideoSlowForward
 */
let ButtonVideoSlowForward = angular.module('ButtonVideoSlowForward', []);

/* Cache the template file */
ButtonVideoSlowForward.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * ButtonVideoSlowForward directive.
 * @module Videoplayer
 * @name ButtonVideoSlowForward
 * @type {directive}
 */
ButtonVideoSlowForward.directive('buttonVideoSlowForward', [
    'VG_STATES',
    function directive(VG_STATES) {

        let mediaElement;
        let videogular;
        let isSeeking = false;
        let slowForwardSeekFrame;
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

            let slowForwardButton = element[0];

            slowForwardButton.addEventListener('mouseup', onMouseUp);
            slowForwardButton.addEventListener('mousedown', onMouseDown);
        }

        function onMouseUp () {

            normalizePlayback();
        }

        function onMouseDown () {

            slowForwardPlayback();
        }

        function normalizePlayback () {

            isSeeking = false;
            cancelAnimationFrame(slowForwardSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function slowForwardPlayback () {

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = 0.5;
            }
            else {

                isSeeking = true;
                seekTime = mediaElement.currentTime;
                stepTime = 0.08;
                slowForwardSeekFrame = requestAnimationFrame(slowForwardSeek);
            }
        }

        function slowForwardSeek () {

            if (!isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime += stepTime;
            }

            slowForwardSeekFrame = requestAnimationFrame(slowForwardSeek);
        }

        return definition;
    }
]);
