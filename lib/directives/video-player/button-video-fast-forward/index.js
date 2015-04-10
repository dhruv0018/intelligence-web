/* Constants */
let TO = '';
const ELEMENTS = 'E';

const RIGHT_KEY = 39;

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');

/**
 * ButtonVideoFastForward module.
 * @module ButtonVideoFastForward
 */
let ButtonVideoFastForward = angular.module('ButtonVideoFastForward', []);

/**
 * ButtonVideoFastForward directive.
 * @module Videoplayer
 * @name ButtonVideoFastForward
 * @type {directive}
 */
ButtonVideoFastForward.directive('buttonVideoFastForward', [
    'VG_STATES',
    function directive(VG_STATES) {

        let button;
        let mediaElement;
        let seekTime;
        let stepTime;
        let isSeeking = false;
        let forwardsSeekFrame;

        const definition = {

            restrict: TO += ELEMENTS,

            require: '^videogular',

            template: template,

            link: link
        };

        function link($scope, element, attributes, videogular) {

            mediaElement = videogular.mediaElement[0];
            button = element[0];

            button.addEventListener('mouseup', onMouseUp);
            button.addEventListener('mousedown', onMouseDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('keydown', onKeyDown);
            element.on('$destroy', onDestroy);
        }

        function onMouseUp () {

            normalPlayback();
        }

        function onMouseDown () {

            forwardPlayback();
        }

        function onKeyUp (event) {

            if (event.keyCode === RIGHT_KEY) {

                normalPlayback();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === RIGHT_KEY) {

                forwardPlayback();
            }
        }

        function normalPlayback () {

            isSeeking = false;
            cancelAnimationFrame(forwardsSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function forwardPlayback () {

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = 2.0;
            }
            else {

                isSeeking = true;
                seekTime = mediaElement.currentTime;
                stepTime = 0.3;
                forwardsSeekFrame = requestAnimationFrame(forwardsSeek);
            }
        }

        function forwardsSeek () {

            if (!isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime += stepTime;
            }

            forwardsSeekFrame = requestAnimationFrame(forwardsSeek);
        }

        function onDestroy () {

            normalPlayback();
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        return definition;
    }
]);
