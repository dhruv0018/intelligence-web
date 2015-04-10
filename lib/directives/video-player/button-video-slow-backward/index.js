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

            isSeeking = true;
            playbackRate = -2.0;
            seekTime = mediaElement.currentTime;
            stepTime = 0.08;
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
        }

        return definition;
    }
]);
