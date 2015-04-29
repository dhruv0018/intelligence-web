/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');
const templateUrl = 'button-video-slow-backward.html';

/**
 * ButtonVideoSlowBackward
 * @module ButtonVideoSlowBackward
 */
let ButtonVideoSlowBackward = angular.module('ButtonVideoSlowBackward', []);

/* Cache the template file */
ButtonVideoSlowBackward.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * ButtonVideoSlowBackward dependencies
 */
buttonVideoSlowBackward.$inject = [
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
function buttonVideoSlowBackward (
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

        templateUrl: templateUrl,

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
        $scope.endSlowBackwardSeeking = endSlowBackwardSeeking;

        button.addEventListener('click', onMouseClick);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PLAY, onPlay);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PAUSE, onPause);
        element.on('$destroy', onDestroy);

        function onPlay () {

            console.log('Play', $scope.seekingState);

            if ($scope.seekingState === SEEKING_STATES.SLOW_BACKWARD) {

                toggleSeeking();
            }
        }

        function onPause () {

            console.log('Pause', $scope.seekingState);

            if ($scope.seekingState === SEEKING_STATES.SLOW_BACKWARD) {

                toggleSeeking();
            }
        }

        function onTimeUpdate () {

            if (mediaElement.currentTime <= 0) {

                endSlowBackwardSeeking();
            }
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function endSlowBackwardSeeking () {

            cancelAnimationFrame(animationFrame);
            $scope.seekingState = SEEKING_STATES.NOT_SEEKING;

            if (wasPlaying) {

                videogular.play();
                wasPlaying = false;
            }
        }

        function beginSlowBackwardSeeking () {

            cancelActiveSeeking();
            $scope.seekingState = SEEKING_STATES.SLOW_BACKWARD;

            if (videogular.currentState === VG_STATES.PLAY) {

                videogular.pause();
                wasPlaying = true;
            }

            seekTime = mediaElement.currentTime;
            stepTime = config.videoplayer.stepTime.slow;
            animationFrame = requestAnimationFrame(step);
        }

        function toggleSeeking () {

            return $scope.seekingState === SEEKING_STATES.SLOW_BACKWARD ? endSlowBackwardSeeking() : beginSlowBackwardSeeking();
        }

        function step () {

            if ($scope.seekingState !== SEEKING_STATES.SLOW_BACKWARD) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            animationFrame = requestAnimationFrame(step);
        }

        function onDestroy () {

            endSlowBackwardSeeking();
            button.removeEventListener('click', onMouseClick);
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

ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', buttonVideoSlowBackward);
