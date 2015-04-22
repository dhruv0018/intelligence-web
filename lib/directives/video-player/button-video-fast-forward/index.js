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
 * ButtonVideoFastForward dependencies.
 */
buttonVideoFastForward.$inject = [
    'VG_STATES',
    'config',
    '$document'
];

/**
 * ButtonVideoFastForward directive.
 * @module ButtonVideoFastForward
 * @name ButtonVideoFastForward
 * @type {directive}
 */
function buttonVideoFastForward (
    VG_STATES,
    config,
    $document
) {

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        template: template,

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular = controller;
        const mediaElement = videogular.mediaElement[0];
        const button = element[0];

        let isSeeking = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        button.addEventListener('click', onMouseClick);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        element.on('$destroy', onDestroy);

        function onMouseClick () {

            toggleSeeking();
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
            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginSeeking () {

            isSeeking = true;

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = config.videoplayer.playbackRate.fast;
            }
            else {

                seekTime = mediaElement.currentTime;
                stepTime = config.videoplayer.stepTime.fast;
                animationFrame = requestAnimationFrame(step);
            }
        }

        function toggleSeeking () {

            return isSeeking ? endSeeking() : beginSeeking();
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
            button.removeEventListener('click', onMouseClick);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }
    }

    return definition;
}

ButtonVideoFastForward.directive('buttonVideoFastForward', buttonVideoFastForward);
