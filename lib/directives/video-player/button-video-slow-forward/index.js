/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/**
 * ButtonVideoSlowForward
 * @module ButtonVideoSlowForward
 */
let ButtonVideoSlowForward = angular.module('ButtonVideoSlowForward', []);

/**
 * ButtonVideoSlowForward dependencies.
 */
buttonVideoSlowForwardDirective.$inject = [
    'VG_STATES',
    'config',
    '$document',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter',
    'SEEKING_STATES'
];

/**
 * ButtonVideoSlowForward directive.
 * @module ButtonVideoSlowForward
 * @name ButtonVideoSlowForward
 * @type {directive}
 */
function buttonVideoSlowForwardDirective (
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

        templateUrl: 'lib/directives/video-player/button-video-slow-forward/template.html',

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular   = controller[0];
        const seeking      = controller[1];
        const button       = element[0];

        button.addEventListener('click', onMouseClick);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onClipComplete);
        element.on('$destroy', onDestroy);

        function onClipComplete () {

            endSlowForwardSeeking();
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function toggleSeeking () {

            return seeking.getCurrentState() === SEEKING_STATES.SLOW_FORWARD ? endSlowForwardSeeking() : beginSlowForwardSeeking();
        }

        function endSlowForwardSeeking () {

            seeking.changeState(SEEKING_STATES.NOT_SEEKING);
        }

        function beginSlowForwardSeeking () {

            seeking.changeState(SEEKING_STATES.SLOW_FORWARD);
        }

        function onDestroy () {

            endSlowForwardSeeking();
            button.removeEventListener('click', onMouseClick);
        }

    }

    return definition;
}

ButtonVideoSlowForward.directive('buttonVideoSlowForward', buttonVideoSlowForwardDirective);

export default ButtonVideoSlowForward;
