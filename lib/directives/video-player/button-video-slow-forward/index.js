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

        link: link
    };

    function link($scope, element, attributes, controller) {

        const videogular = controller;
        const mediaElement = videogular.mediaElement[0];
        const button = element[0];
        const indicator = angular.element($document[0].getElementsByClassName('sfwd')[0]);

        let isSeeking = false;

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        element.on('$destroy', onDestroy);

        function onMouseUp () {

            indicator.removeClass('seeking-speed');
            indicator.addClass('ng-hide');

            endSeeking();
        }

        function onMouseDown () {

            indicator.removeClass('ng-hide');
            indicator.addClass('seeking-speed');

            beginSeeking();
        }

        function endSeeking () {

            if (isSeeking) {

                videogular.pause();
                isSeeking = false;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        }

        function beginSeeking () {

            if (videogular.currentState !== VG_STATES.PLAY) {

                videogular.play();
                isSeeking = true;
            }

            mediaElement.playbackRate = config.videoplayer.playbackRate.slow;
        }

        function onDestroy () {

            endSeeking();
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
        }
    }

    return definition;
}

ButtonVideoSlowForward.directive('buttonVideoSlowForward', buttonVideoSlowForward);
