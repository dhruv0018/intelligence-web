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
 * ButtonVideoSlowBackward dependencies
 */
buttonVideoSlowBackward.$inject = [
    'VG_STATES',
    'config',
    '$document'
];

/**
 * ButtonVideoSlowBackward directive.
 * @module Videoplayer
 * @name ButtonVideoSlowBackward
 * @type {directive}
 */
function buttonVideoSlowBackward (
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

        templateUrl: templateUrl,

        link: link
    };

    function link($scope, element, attributes, controller) {

        videogular = controller;
        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        element.on('$destroy', onDestroy);

        indicator = angular.element($document[0].getElementsByClassName('sbkwd')[0]);
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
        stepTime = config.videoplayer.stepTime.slow;
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

ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', buttonVideoSlowBackward);