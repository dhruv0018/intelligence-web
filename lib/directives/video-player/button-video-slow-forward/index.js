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
    '$document'
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
    $document
) {

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        templateUrl: templateUrl,

        scope: {},

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular = controller;
        const mediaElement = videogular.mediaElement[0];
        const button = element[0];

        $scope.isSeeking = false;
        let animationFrame;
        let seekTime;
        let stepTime;

        button.addEventListener('click', onMouseClick);
        element.on('$destroy', onDestroy);

        function onMouseClick () {

            toggleSeeking();
        }

        function endSeeking () {

            $scope.isSeeking = false;
            cancelAnimationFrame(animationFrame);
            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginSeeking () {

            $scope.isSeeking = true;

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = config.videoplayer.playbackRate.slow;
            }
            else {

                seekTime = mediaElement.currentTime;
                stepTime = config.videoplayer.stepTime.slow;
                animationFrame = requestAnimationFrame(step);
            }
        }

        function toggleSeeking () {

            return $scope.isSeeking ? endSeeking() : beginSeeking();
        }

        function step () {

            if (!$scope.isSeeking) return;

            if (!mediaElement.seeking) {

                mediaElement.currentTime = seekTime += stepTime;
            }

            animationFrame = requestAnimationFrame(step);
        }

        function onDestroy () {

            endSeeking();
            button.removeEventListener('click', onMouseClick);
        }
    }

    return definition;
}

ButtonVideoSlowForward.directive('buttonVideoSlowForward', buttonVideoSlowForward);
