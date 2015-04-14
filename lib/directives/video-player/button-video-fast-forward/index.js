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
 * @module Videoplayer
 * @name ButtonVideoFastForward
 * @type {directive}
 */
function buttonVideoFastForward (
    VG_STATES,
    config,
    $document
) {

    let indicator;
    let videogular;
    let mediaElement;
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

    function link($scope, element, attributes, controller) {

        videogular = controller;
        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        element.on('$destroy', onDestroy);

        indicator = angular.element($document[0].getElementsByClassName('ffwd')[0]);
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

        if (videogular.currentState === VG_STATES.PLAY) {

            mediaElement.playbackRate = config.videoplayer.playbackRate.fast;
        }
        else {

            isSeeking = true;
            seekTime = mediaElement.currentTime;
            stepTime = config.videoplayer.stepTime.fast;
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

ButtonVideoFastForward.directive('buttonVideoFastForward', buttonVideoFastForward);
