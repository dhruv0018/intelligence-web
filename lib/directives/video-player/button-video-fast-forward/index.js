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
        const indicator = angular.element($document[0].getElementsByClassName('ffwd')[0]);

        let isSeeking = false;

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        Mousetrap.bind('right', onKeyUp, 'keyup');
        Mousetrap.bind('right', onKeyDown, 'keydown');
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

            if (isSeeking) {

                videogular.pause();
                isSeeking = false;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginSeeking () {

            if (videogular.currentState !== VG_STATES.PLAY) {

                videogular.play();
                isSeeking = true;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.fast;
        }

        function onDestroy () {

            endSeeking();
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            Mousetrap.unbind('right');
        }
    }

    return definition;
}

ButtonVideoFastForward.directive('buttonVideoFastForward', buttonVideoFastForward);
