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
 * ButtonVideoSlowForward dependencies.
 */
buttonVideoFastBackward.$inject = [
    'VG_STATES',
    'config',
    '$document'
];

/**
 * ButtonVideoFastBackward directive.
 * @module ButtonVideoFastBackward
 * @name ButtonVideoFastBackward
 * @type {directive}
 */
function buttonVideoFastBackward (
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
        let wasPlaying = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        element.on('$destroy', onDestroy);

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

            if (wasPlaying) {

                videogular.play();
                wasPlaying = false;
            }
        }

        function beginSeeking () {

            isSeeking = true;

            if (videogular.currentState === VG_STATES.PLAY) {

                videogular.pause();
                wasPlaying = true;
            }

            seekTime = mediaElement.currentTime;
            stepTime = config.videoplayer.stepTime.fast;
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
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }
    }

    return definition;
}

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
