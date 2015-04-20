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

    let indicator;
    let videogular;
    let mediaElement;
    let button;
    let isSeeking = false;
    let wasPaused = false;

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        templateUrl: templateUrl,

        link: link
    };

    function link($scope, element, attributes, controller) {

        videogular = controller;
        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mousedown', onMouseDown);
        element.on('$destroy', onDestroy);

        indicator = angular.element($document[0].getElementsByClassName('sfwd')[0]);
    }

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

        isSeeking = false;

        if (wasPaused) {

            videogular.pause();
            wasPaused = false;
        }

        mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
    }

    function beginSeeking () {

        if (videogular.currentState !== VG_STATES.PLAY) {

            videogular.play();
            wasPaused = true;
        }

        mediaElement.playbackRate = config.videoplayer.playbackRate.slow;
    }

    function onDestroy () {

        endSeeking();
        button.removeEventListener('mouseup', onMouseUp);
        button.removeEventListener('mousedown', onMouseDown);
    }

    return definition;
}

ButtonVideoSlowForward.directive('buttonVideoSlowForward', buttonVideoSlowForward);
