/* Constants */
var TO = '';
var ELEMENTS = 'E';

var LEFT_KEY = 37;

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Template */
var template = require('./template.html');

/**
 * ButtonVideoFastBackward module.
 * @module ButtonVideoFastBackward
 */
var ButtonVideoFastBackward = angular.module('ButtonVideoFastBackward', []);

/**
 * ButtonVideoFastBackward directive.
 * @module Videoplayer
 * @name ButtonVideoFastBackward
 * @type {directive}
 */
ButtonVideoFastBackward.directive('buttonVideoFastBackward', [
    'VG_STATES', 'VideoPlayer',
    function directive(VG_STATES, videoPlayer) {

        var button;
        var videogular;
        var mediaElement;
        var stepTime;
        var seekTime;
        var isSeeking = false;
        var backwardsSeekFrame;
        var removeCurrentStateWatch;

        var definition = {
            restrict: TO += ELEMENTS,
            require: '^videogular',
            template: template,
            link: link
        };

        function link($scope, element, attributes, controller) {

            videogular = controller;
            mediaElement = videogular.mediaElement[0];

            button = element[0].getElementsByTagName('button')[0];

            button.addEventListener('mouseup', onMouseUp);
            button.addEventListener('mousedown', onMouseDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('keydown', onKeyDown);
            removeCurrentStateWatch = $scope.$watch(currentStateWatch, onCurrentStateChange);
            element.on('$destroy', onDestroy);
        }

        function backwardsSeek () {

            if (!isSeeking) return;

            if (mediaElement.seeking !== true) {

                mediaElement.currentTime = seekTime -= stepTime;
            }

            backwardsSeekFrame = requestAnimationFrame(backwardsSeek);
        }

        function normalPlayback () {

            isSeeking = false;
            cancelAnimationFrame(backwardsSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function backwardPlayback () {

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = -2.0;
            }
            else {

                isSeeking = true;
                seekTime = mediaElement.currentTime;
                stepTime = 0.3;
                backwardsSeekFrame = requestAnimationFrame(backwardsSeek);
            }
        }


        function currentStateWatch () {

            return videogular.currentState;
        }

        function onCurrentStateChange () {

            if (videogular.currentState === VG_STATES.PLAY) {

                normalPlayback();
            }
        }

        function onMouseUp () {

            normalPlayback();
        }

        function onMouseDown () {

            backwardPlayback();
        }

        function onKeyUp (event) {

            if (event.keyCode === LEFT_KEY) {

                normalPlayback();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === LEFT_KEY) {

                backwardPlayback();
            }
        }

        function onDestroy () {

            normalPlayback();
            removeCurrentStateWatch();
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        return definition;
    }
]);
