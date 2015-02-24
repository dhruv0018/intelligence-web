/* Constants */
var TO = '';
var ELEMENTS = 'E';

var LEFT_KEY = 37;

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Template */
var template = require('./template.html');

/**
 * ButtonVideoBackward module.
 * @module ButtonVideoBackward
 */
var ButtonVideoBackward = angular.module('ButtonVideoBackward', []);

/**
 * ButtonVideoBackward directive.
 * @module Videoplayer
 * @name ButtonVideoBackward
 * @type {directive}
 */
ButtonVideoBackward.directive('buttonVideoBackward', [
    'VG_STATES', 'VideoPlayer',
    function directive(VG_STATES, videoPlayer) {

        var videogular;
        var mediaElement;
        var backwardsSeekFrame;
        var start;
        var seekTime;
        var isSeeking = true;

        var directive = {
            restrict: TO += ELEMENTS,
            require: '^videogular',
            template: template,
            link: link
        };

        function link($scope, element, attributes, controller) {

            $scope.VG_STATES = VG_STATES;

            videogular = controller;
            mediaElement = videogular.mediaElement[0];

            var button = element[0].getElementsByTagName('button')[0];

            button.addEventListener('mouseup', onMouseUp);
            button.addEventListener('mousedown', onMouseDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('keydown', onKeyDown);
            element.on('$destroy', onDestroy);
        }

        function backwardsSeek (timestamp) {

            if (!isSeeking) return;
            if (!start) start = timestamp;

            var delta = timestamp - start;

            if (delta > 250) {

                start = performance.now();
                mediaElement.currentTime -= seekTime;
            }

            backwardsSeekFrame = requestAnimationFrame(backwardsSeek);
        }

        function normalPlayback () {

            isSeeking = false;
            cancelAnimationFrame(backwardsSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function backwardPlayback () {

            isSeeking = true;
            mediaElement.playbackRate = 0;
            seekTime = videogular.currentState === VG_STATES.PLAY ? 0.5 : 0.01;
            backwardsSeekFrame = requestAnimationFrame(backwardsSeek);
        }

        function onMouseUp (event) {

            normalPlayback();
        }

        function onMouseDown (event) {

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
            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        return directive;
    }
]);

