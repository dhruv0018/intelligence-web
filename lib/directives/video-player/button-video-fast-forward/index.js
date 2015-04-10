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

        let mediaElement;
        let playbackRate;
        let button;
        let isSeeking = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        const definition = {

            restrict: TO += ELEMENTS,

            require: '^videogular',

            template: template,

            link: link
        };

        function link($scope, element, attributes, videogular) {

            mediaElement = videogular.mediaElement[0];
            playbackRate = mediaElement.playbackRate;
            button = element[0];

            button.addEventListener('mouseup', onMouseUp);
            button.addEventListener('mousedown', onMouseDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('keydown', onKeyDown);
            element.on('$destroy', onDestroy);
        }

        function onMouseUp () {

            endSeeking();
        }

        function onMouseDown () {

            beginSeeking();
        }

        function onKeyUp (event) {

            if (event.keyCode === RIGHT_KEY) {

                endSeeking();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === RIGHT_KEY) {

                beginSeeking();
            }
        }

        function endSeeking () {

            isSeeking = false;
            cancelAnimationFrame(animationFrame);
            playbackRate = 1.0;
        }

        function beginSeeking () {

            if (videogular.currentState === VG_STATES.PLAY) {

                playbackRate = 2.0;
            }
            else {

                isSeeking = true;
                seekTime = mediaElement.currentTime;
                stepTime = 0.3;
                animationFrame = requestAnimationFrame(step);
            }
        }

        function step () {

            if (!isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime += stepTime;
            }

            animationFrame = requestAnimationFrame(step);
        }

        function onDestroy () {

            endSeeking();
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        return definition;
    }
]);
