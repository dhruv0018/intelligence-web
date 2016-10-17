/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/**
 * ButtonVideoSlowBackward
 * @module ButtonVideoSlowBackward
 */
let ButtonVideoSlowBackward = angular.module('ButtonVideoSlowBackward', []);

/**
 * ButtonVideoSlowBackward dependencies
 */
buttonVideoSlowBackwardDirective.$inject = [
    'VG_STATES',
    'config',
    '$document',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter',
    'SEEKING_STATES'
];

/**
 * ButtonVideoSlowBackward directive.
 * @module ButtonVideoSlowBackward
 * @name ButtonVideoSlowBackward
 * @type {directive}
 */
function buttonVideoSlowBackwardDirective (
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

        templateUrl: 'lib/directives/video-player/button-video-slow-backward/template.html',

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular   = controller[0];
        const seeking      = controller[1];
        const mediaElement = videogular.mediaElement[0];
        const button       = element[0];

        button.addEventListener('click', onMouseClick);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
        element.on('$destroy', onDestroy);

        function onTimeUpdate () {

            if (mediaElement.currentTime <= 0) {

                endSlowBackwardSeeking();
            }
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function endSlowBackwardSeeking () {

            seeking.changeState(SEEKING_STATES.NOT_SEEKING);
        }

        function beginSlowBackwardSeeking () {

            seeking.changeState(SEEKING_STATES.SLOW_BACKWARD);
        }

        function toggleSeeking () {

            return seeking.getCurrentState() === SEEKING_STATES.SLOW_BACKWARD ? endSlowBackwardSeeking() : beginSlowBackwardSeeking();
        }

        function onDestroy () {

            endSlowBackwardSeeking();
            button.removeEventListener('click', onMouseClick);
        }

    }

    return definition;
}

ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', buttonVideoSlowBackwardDirective);

export default ButtonVideoSlowBackward;
