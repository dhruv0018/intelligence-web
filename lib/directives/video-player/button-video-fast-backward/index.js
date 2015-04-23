/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

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
        const indicator = angular.element($document[0].getElementsByClassName('fbkwd')[0]);

        let isSeeking = false;
        let wasPlaying = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        Mousetrap.bind('left', onKeyUp, 'keyup');
        Mousetrap.bind('left', onKeyDown, 'keydown');
        element.on('$destroy', onDestroy);

        function onMouseUp () {

            indicator.removeClass('seeking-speed');
            indicator.addClass('ng-hide');

            endSeeking();
        }

        function onMouseDown () {

            indicator.removeClass('ng-hide');
            indicator.addClass('seeking-speed');

            beginSeeking();
        }

        function onKeyUp (event) {

            endSeeking();
        }

        function onKeyDown (event) {

            beginSeeking();
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
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            Mousetrap.unbind('left');
        }
    }

    return definition;
}

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
