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
        let animationFrame;
        let seekTime;
        let stepTime;
        let wasPlaying = false;
        $scope.endFastBackwardSeeking = endFastBackwardSeeking;

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

            cancelAnimationFrame(animationFrame);
            $scope.seekingState = SEEKING_STATES.NOT_SEEKING;

            if (wasPlaying) {

                videogular.play();
                wasPlaying = false;
            }
        }

        function beginFastBackwardSeeking () {

            cancelActiveSeeking();
            $scope.seekingState = SEEKING_STATES.FAST_BACKWARD;

            if (videogular.currentState === VG_STATES.PLAY) {

                videogular.pause();
                wasPlaying = true;
            }

            seekTime = mediaElement.currentTime;
            stepTime = config.videoplayer.stepTime.fast;
            animationFrame = requestAnimationFrame(step);
        }

        function toggleSeeking () {

            return $scope.seekingState === SEEKING_STATES.FAST_BACKWARD ? endFastBackwardSeeking() : beginFastBackwardSeeking();
        }

        function step () {

            if ($scope.seekingState !== SEEKING_STATES.FAST_BACKWARD) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            animationFrame = requestAnimationFrame(step);
        }

        function onDestroy () {

            endFastBackwardSeeking();
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

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
