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
    'VideoPlayerEventEmitter'
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
    VideoPlayerEventEmitter
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

        $scope.isSeeking = false;
        let wasPlaying = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        button.addEventListener('click', onMouseClick);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
        element.on('$destroy', onDestroy);

        function onTimeUpdate () {

            if (mediaElement.currentTime <= 0) {

                endSeeking();
            }
        }

        function onMouseClick () {

            toggleSeeking();
        }

        function onKeyUp (event) {

            if (event.keyCode === LEFT_KEY) {

                endSeeking();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === LEFT_KEY) {

                beginSeeking();
            }
        }

        function endSeeking () {

            $scope.isSeeking = false;
            cancelAnimationFrame(animationFrame);

            if (wasPlaying) {

                videogular.play();
                wasPlaying = false;
            }
        }

        function beginSeeking () {

            $scope.isSeeking = true;

            if (videogular.currentState === VG_STATES.PLAY) {

                videogular.pause();
                wasPlaying = true;
            }

            seekTime = mediaElement.currentTime;
            stepTime = config.videoplayer.stepTime.fast;
            animationFrame = requestAnimationFrame(step);
        }

        function toggleSeeking () {

            return $scope.isSeeking ? endSeeking() : beginSeeking();
        }

        function step () {

            if (!$scope.isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            animationFrame = requestAnimationFrame(step);
        }

        function onDestroy () {

            endSeeking();
            button.removeEventListener('click', onMouseClick);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }
    }

    return definition;
}

ButtonVideoFastBackward.directive('buttonVideoFastBackward', buttonVideoFastBackward);
