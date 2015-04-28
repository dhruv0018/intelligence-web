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
    'VideoPlayerEventEmitter'
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
    VideoPlayerEventEmitter
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

        $scope.isSeeking = false;
        let wasPlaying = false;
        let animationFrame;
        let seekTime;
        let stepTime;
        $scope.endSlowBackwardSeeking = endSlowBackwardSeeking;

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

            $scope.isSeeking = false;
            cancelAnimationFrame(animationFrame);

            if (wasPlaying) {

                videogular.play();
                wasPlaying = false;
            }
        }

        function beginSlowBackwardSeeking () {

            $scope.isSeeking = true;

            if (videogular.currentState === VG_STATES.PLAY) {

                videogular.pause();
                wasPlaying = true;
            }

            seekTime = mediaElement.currentTime;
            stepTime = config.videoplayer.stepTime.slow;
            animationFrame = requestAnimationFrame(step);
        }

        function toggleSeeking () {

            return $scope.isSeeking ? endSlowBackwardSeeking() : beginSlowBackwardSeeking();
        }

        function step () {

            if (!$scope.isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            animationFrame = requestAnimationFrame(step);
        }

        function onDestroy () {

            endSlowBackwardSeeking();
            button.removeEventListener('click', onMouseClick);
        }
    }

    return definition;
}

ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', buttonVideoSlowBackward);
