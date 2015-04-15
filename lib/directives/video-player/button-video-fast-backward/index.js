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
 * @module Videoplayer
 * @name ButtonVideoFastBackward
 * @type {directive}
 */
function buttonVideoFastBackward (
    VG_STATES,
    config,
    $document
) {

    let indicator;
    let mediaElement;
    let videogular;
    let button;
    let isSeeking = false;
    let wasPlaying = false;
    let animationFrame;
    let seekTime;
    let stepTime;

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        template: template,

        link: link
    };

    function link($scope, element, attributes, controller) {

        videogular = controller;
        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        element.on('$destroy', onDestroy);

        indicator = angular.element($document[0].getElementsByClassName('fbkwd')[0]);
    }

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
        button.removeEventListener('mouseup', onMouseUp);
        button.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('keydown', onKeyDown);
    }

    return definition;
}

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
