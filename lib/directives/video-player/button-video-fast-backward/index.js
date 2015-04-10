/* Constants */
let TO = '';
const ELEMENTS = 'E';

const LEFT_KEY = 37;

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');

/**
 * ButtonVideoFastBackward module.
 * @module ButtonVideoFastBackward
 */
let ButtonVideoFastBackward = angular.module('ButtonVideoFastBackward', []);

/**
 * ButtonVideoFastBackward directive.
 * @module Videoplayer
 * @name ButtonVideoFastBackward
 * @type {directive}
 */
ButtonVideoFastBackward.directive('buttonVideoFastBackward', [
    'VG_STATES', 'VideoPlayer',
    function directive(VG_STATES, videoPlayer) {

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

            if (event.keyCode === LEFT_KEY) {

                endSeeking();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === LEFT_KEY) {

                beginSeeking();
            }
        }

        function endSeeking () {

            isSeeking = false;
            cancelAnimationFrame(animationFrame);
            playbackRate = 1.0;
        }

        function beginSeeking () {

            isSeeking = true;
            playbackRate = -2.0;
            seekTime = mediaElement.currentTime;
            stepTime = 0.3;
            animationFrame = requestAnimationFrame(step);
        }

        function step () {

            if (!isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
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
