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
    '$document',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter',
    'SEEKING_STATES'
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
    $document,
    VIDEO_PLAYER_EVENTS,
    VideoPlayerEventEmitter,
    SEEKING_STATES
) {

    const definition = {

        restrict: TO += ELEMENTS,

        require: ['^videogular', '^videoPlayerSeekingControls'],

        template: template,

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular   = controller[0];
        const seeking      = controller[1];
        const mediaElement = videogular.mediaElement[0];
        const button       = element[0];

        button.addEventListener('click', onMouseClick);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
        element.on('$destroy', onDestroy);

        function onTimeUpdate () {

            if (mediaElement.currentTime <= 0) {

                endFastBackwardSeeking();
            }
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function onKeyUp (event) {

            if (event.keyCode === LEFT_KEY) {

                endFastBackwardSeeking();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === LEFT_KEY) {

                beginFastBackwardSeeking();
            }
        }

        function endFastBackwardSeeking () {

            seeking.changeState(SEEKING_STATES.NOT_SEEKING);
        }

        function beginFastBackwardSeeking () {

            seeking.changeState(SEEKING_STATES.FAST_BACKWARD);
        }

        function toggleSeeking () {

            return seeking.getCurrentState() === SEEKING_STATES.FAST_BACKWARD ? endFastBackwardSeeking() : beginFastBackwardSeeking();
        }

        function onDestroy () {

            endFastBackwardSeeking();
            button.removeEventListener('click', onMouseClick);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

    }

    return definition;
}

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
