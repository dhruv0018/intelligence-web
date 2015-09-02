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
        if (!$scope.userIsIndexer) {
            Mousetrap.bind('left', onKeyUp, 'keyup');
            Mousetrap.bind('left', onKeyDown, 'keydown');
        }
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

            endFastBackwardSeeking();
        }

        function onKeyDown (event) {

            beginFastBackwardSeeking();
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
            if (!$scope.userIsIndexer) {
                Mousetrap.unbind('left');
            }
        }

    }

    return definition;
}

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
