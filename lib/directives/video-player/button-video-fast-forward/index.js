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
    '$document',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter',
    'SEEKING_STATES'
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
        const button       = element[0];

        button.addEventListener('click', onMouseClick);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onClipComplete);
        element.on('$destroy', onDestroy);

        function onClipComplete () {

            endFastForwardSeeking();
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function onKeyUp (event) {

            if (event.keyCode === RIGHT_KEY) {

                endFastForwardSeeking();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === RIGHT_KEY) {

                beginFastForwardSeeking();
            }
        }

        function toggleSeeking () {

            return seeking.getCurrentState() === SEEKING_STATES.FAST_FORWARD ? endFastForwardSeeking() : beginFastForwardSeeking();
        }

        function endFastForwardSeeking () {

            seeking.changeState(SEEKING_STATES.NOT_SEEKING);
        }

        function beginFastForwardSeeking () {

            seeking.changeState(SEEKING_STATES.FAST_FORWARD);
        }

        function onDestroy () {

            endFastForwardSeeking();
            button.removeEventListener('click', onMouseClick);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }
    }

    return definition;
}

ButtonVideoFastForward.directive('buttonVideoFastForward', buttonVideoFastForward);
