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

        require: ['^videogular', '^videoPlayerSeekingControls'],

        templateUrl: templateUrl,

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular   = controller[0];
        const seeking      = controller[1];
        const mediaElement = videogular.mediaElement[0];
        const button       = element[0];

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

            seeking.changeState(SEEKING_STATES.NOT_SEEKING);
        }

        function beginSlowBackwardSeeking () {

            seeking.changeState(SEEKING_STATES.SLOW_BACKWARD);
        }

        function toggleSeeking () {

            return seeking.getCurrentState() === SEEKING_STATES.SLOW_BACKWARD ? endSlowBackwardSeeking() : beginSlowBackwardSeeking();
        }

        function onDestroy () {

            endSlowBackwardSeeking();
            button.removeEventListener('click', onMouseClick);
        }

    }

    return definition;
}

ButtonVideoSlowBackward.directive('buttonVideoSlowBackward', buttonVideoSlowBackward);
