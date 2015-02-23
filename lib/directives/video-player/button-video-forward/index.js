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

        var videogular;
        var mediaElement;
        var forwardsSeekFrame;
        var start;

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

        function forwardsSeek (timestamp) {

            if (!start) start = timestamp;

            var delta = timestamp - start;

            if (delta > 250) {

                start = performance.now();
                mediaElement.currentTime += 0.26;
            }

            forwardsSeekFrame = requestAnimationFrame(forwardsSeek);
        }

        function normalPlayback () {

            cancelAnimationFrame(forwardsSeekFrame);
            mediaElement.playbackRate = 1.0;
        }

        function forwardPlayback () {

            if (videogular.currentState === VG_STATES.PLAY) {

                mediaElement.playbackRate = 2.0;
            }

            else {

                mediaElement.playbackRate = 0;
                forwardsSeekFrame = requestAnimationFrame(forwardsSeek);
            }
        }

        function onMouseUp (event) {

            normalPlayback();
        }

        function onMouseDown (event) {

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

            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        return directive;
    }
]);

