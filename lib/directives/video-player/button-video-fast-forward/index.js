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

        require: '^videogular',

        template: template,

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular = controller;
        const mediaElement = videogular.mediaElement[0];
        const button = element[0];

        $scope.SEEKING_STATES = SEEKING_STATES;
        $scope.seekingState = SEEKING_STATES.NOT_SEEKING;
        $scope.endFastForwardSeeking = endFastForwardSeeking;
        let wasPlaying = false;

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

            return $scope.seekingState === SEEKING_STATES.FAST_FORWARD ? endFastForwardSeeking() : beginFastForwardSeeking();
        }

        function endFastForwardSeeking () {

            $scope.seekingState = SEEKING_STATES.NOT_SEEKING;

            if (wasPlaying) {

                videogular.pause();
                wasPlaying = false;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginFastForwardSeeking () {

            cancelActiveSeeking();
            $scope.seekingState = SEEKING_STATES.FAST_FORWARD;

            if (videogular.currentState !== VG_STATES.PLAY) {

                videogular.play();
                wasPlaying = true;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.fast;
        }

        function onDestroy () {

            endFastForwardSeeking();
            button.removeEventListener('click', onMouseClick);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        function cancelActiveSeeking () {

            switch ($scope.seekingState) {

                case SEEKING_STATES.FAST_BACKWARD:

                    $scope.endFastBackwardSeeking();
                    break;

                case SEEKING_STATES.SLOW_BACKWARD:

                    $scope.endSlowBackwardSeeking();
                    break;

                case SEEKING_STATES.SLOW_FORWARD:

                    $scope.endSlowForwardSeeking();
                    break;

                case SEEKING_STATES.FAST_FORWARD:

                    $scope.endFastForwardSeeking();
                    break;
            }
        }
    }

    return definition;
}

ButtonVideoFastForward.directive('buttonVideoFastForward', buttonVideoFastForward);
