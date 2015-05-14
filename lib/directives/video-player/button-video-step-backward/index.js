/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');

/**
 * ButtonVideoStepBackward module.
 * @module ButtonVideoStepBackward
 */
let ButtonVideoStepBackward = angular.module('ButtonVideoStepBackward', []);

/**
 * ButtonVideoStepBackward dependencies.
 */
buttonVideoStepBackward.$inject = [
    'config',
    '$document'
];

/**
 * ButtonVideoStepBackward directive.
 * @module ButtonVideoStepBackward
 * @name ButtonVideoStepBackward
 * @type {directive}
 */
function buttonVideoStepBackward (
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

        mediaElement.currentTime -= config.videoplayer.stepTime.increment;
    }

    function onDestroy () {

        button.removeEventListener('click', onMouseClick);
    }

    return definition;
}

ButtonVideoStepBackward.directive('buttonVideoStepBackward', buttonVideoStepBackward);
