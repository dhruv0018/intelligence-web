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

        let button;
        let mediaElement;
        let stepTime;
        let seekTime;
        let isSeeking = false;
        let backwardsSeekFrame;

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

            backwardPlayback();
        }

        function onKeyUp (event) {

            if (event.keyCode === LEFT_KEY) {

                normalPlayback();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === LEFT_KEY) {

                backwardPlayback();
            }
        }

        function normalPlayback () {

            isSeeking = false;
            cancelAnimationFrame(backwardsSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function backwardPlayback () {

            isSeeking = true;
            mediaElement.playbackRate = -2.0;
            seekTime = mediaElement.currentTime;
            stepTime = 0.3;
            backwardsSeekFrame = requestAnimationFrame(backwardsSeek);
        }

        function backwardsSeek () {

            if (!isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            backwardsSeekFrame = requestAnimationFrame(backwardsSeek);
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
