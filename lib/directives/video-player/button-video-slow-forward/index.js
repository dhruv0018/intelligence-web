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
    'VideoPlayerEventEmitter'
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
        $scope.endSlowForwardSeeking = endSlowForwardSeeking;

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

            return $scope.isSeeking ? endSlowForwardSeeking() : beginSlowForwardSeeking();
        }

        function endSlowForwardSeeking () {

            if ($scope.isSeeking) {

                videogular.pause();
                $scope.isSeeking = false;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginSlowForwardSeeking () {

            $scope.isSeeking = true;

            if (videogular.currentState !== VG_STATES.PLAY) {

                videogular.play();
                $scope.isSeeking = true;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.slow;
        }

        function onDestroy () {

            endSlowForwardSeeking();
            button.removeEventListener('click', onMouseClick);
        }
    }

    return definition;
}

ButtonVideoSlowForward.directive('buttonVideoSlowForward', buttonVideoSlowForward);
