/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

/**
 * ButtonVideoFastForward module.
 * @module ButtonVideoFastForward
 */
let ButtonVideoFastForward = angular.module('ButtonVideoFastForward', []);

/**
 * ButtonVideoFastForward dependencies.
 */
buttonVideoFastForwardDirective.$inject = [
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
function buttonVideoFastForwardDirective (
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

        templateUrl: 'lib/directives/video-player/button-video-fast-forward/template.html',

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular   = controller[0];
        const seeking      = controller[1];
        const button       = element[0];

        button.addEventListener('click', onMouseClick);
        if (!$scope.userIsIndexer) {
            Mousetrap.bind('right', onKeyUp, 'keyup');
            Mousetrap.bind('right', onKeyDown, 'keydown');
        }
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onClipComplete);

        element.on('$destroy', onDestroy);

        function onClipComplete () {

            endFastForwardSeeking();
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function onKeyUp (event) {

            endFastForwardSeeking();
        }

        function onKeyDown (event) {

            beginFastForwardSeeking();
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
        }
    }

    return definition;
}

ButtonVideoFastForward.directive('buttonVideoFastForward', buttonVideoFastForwardDirective);

export default ButtonVideoFastForward;
