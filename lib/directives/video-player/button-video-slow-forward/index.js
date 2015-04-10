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
        let playbackRate;
        let button;
        let isSeeking = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        const definition = {

            restrict: TO += ELEMENTS,

            require: '^videogular',

            templateUrl: templateUrl,

            link: link
        };

        function link($scope, element, attributes, videogular) {

            mediaElement = videogular.mediaElement[0];
            playbackRate = mediaElement.playbackRate;
            button = element[0];

            button.addEventListener('mouseup', onMouseUp);
            button.addEventListener('mousedown', onMouseDown);
            element.on('$destroy', onDestroy);
        }

        function onMouseUp () {

            endSeeking();
        }

        function onMouseDown () {

            beginSeeking();
        }

        function endSeeking () {

            isSeeking = false;
            cancelAnimationFrame(animationFrame);
            playbackRate = 1.0;
        }

        function beginSeeking () {

            if (videogular.currentState === VG_STATES.PLAY) {

                playbackRate = 0.5;
            }
            else {

                isSeeking = true;
                seekTime = mediaElement.currentTime;
                stepTime = 0.08;
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
        }

        return definition;
    }
]);
