/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');

/**
 * ButtonVideoStepForward module.
 * @module ButtonVideoStepForward
 */
let ButtonVideoStepForward = angular.module('ButtonVideoStepForward', []);

/**
 * ButtonVideoStepForward dependencies.
 */
buttonVideoStepForward.$inject = [
    'config',
    '$document'
];

/**
 * ButtonVideoStepForward directive.
 * @module ButtonVideoStepForward
 * @name ButtonVideoStepForward
 * @type {directive}
 */
function buttonVideoStepForward (
    config,
    $document
) {

    let mediaElement;
    let button;
    let animationFrame;

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        template: template,

        link: link
    };

    function link($scope, element, attributes, videogular) {

        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('click', onMouseClick);
        element.on('$destroy', onDestroy);
    }

    function onMouseClick () {

        step();
    }

    function step () {

        animationFrame = requestAnimationFrame(increment);
    }

    function increment () {

        mediaElement.currentTime += config.videoplayer.stepTime.increment;
    }

    function onDestroy () {

        button.removeEventListener('click', onMouseClick);
    }

    return definition;
}

ButtonVideoStepForward.directive('buttonVideoStepForward', buttonVideoStepForward);
