/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');
const templateUrl = 'button-video-slow-forward.html';

/**
 * ButtonVideoSlowForward
 * @module ButtonVideoSlowForward
 */
let ButtonVideoSlowForward = angular.module('ButtonVideoSlowForward', []);

/* Cache the template file */
ButtonVideoSlowForward.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * ButtonVideoSlowForward dependencies.
 */
buttonVideoSlowForward.$inject = [
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
function buttonVideoSlowForward (
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
        $scope.endSlowForwardSeeking = endSlowForwardSeeking;
        let wasPlaying = false;

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

            return $scope.seekingState === SEEKING_STATES.SLOW_FORWARD ? endSlowForwardSeeking() : beginSlowForwardSeeking();
        }

        function endSlowForwardSeeking () {

            $scope.seekingState = SEEKING_STATES.NOT_SEEKING;

            if (wasPlaying) {

                videogular.pause();
                wasPlaying = true;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginSlowForwardSeeking () {

            cancelActiveSeeking();
            $scope.seekingState = SEEKING_STATES.SLOW_FORWARD;

            if (videogular.currentState !== VG_STATES.PLAY) {

                videogular.play();
                wasPlaying = false;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.slow;
        }

        function onDestroy () {

            endSlowForwardSeeking();
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

ButtonVideoSlowForward.directive('buttonVideoSlowForward', buttonVideoSlowForward);
