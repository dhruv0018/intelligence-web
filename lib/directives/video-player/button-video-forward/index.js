/* Constants */
var TO = '';
var ELEMENTS = 'E';

var RIGHT_KEY = 39;

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Template */
var template = require('./template.html');

/**
 * ButtonVideoForward module.
 * @module ButtonVideoForward
 */
var ButtonVideoForward = angular.module('ButtonVideoForward', []);

/**
 * ButtonVideoForward directive.
 * @module Videoplayer
 * @name ButtonVideoForward
 * @type {directive}
 */
ButtonVideoForward.directive('buttonVideoForward', [
    'VG_STATES',
    function directive(VG_STATES) {

        var button;
        var videogular;
        var mediaElement;
        var seekTime;
        var stepTime;
        var isSeeking = false;
        var forwardsSeekFrame;
        var removeCurrentStateWatch;

        var definition = {
            restrict: TO += ELEMENTS,
            require: '^videogular',
            template: template,
            link: link
        };

        function link($scope, element, attributes, controller) {

            $scope.VG_STATES = VG_STATES;

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

        function forwardsSeek () {

            if (!isSeeking) return;

            if (mediaElement.seeking !== true) {

                mediaElement.currentTime = seekTime += stepTime;
            }

            forwardsSeekFrame = requestAnimationFrame(forwardsSeek);
        }

        function normalPlayback () {

            isSeeking = false;
            cancelAnimationFrame(forwardsSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function forwardPlayback () {

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = 2.0;
            }

            else {

                isSeeking = true;
                seekTime = mediaElement.currentTime;
                stepTime = 0.01;
                videogular.pause();
                forwardsSeekFrame = requestAnimationFrame(forwardsSeek);
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

            forwardPlayback();
        }

        function onKeyUp (event) {

            if (event.keyCode === RIGHT_KEY) {

                normalPlayback();
            }
        }

        function onKeyDown (event) {

            if (event.keyCode === RIGHT_KEY) {

                forwardPlayback();
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
