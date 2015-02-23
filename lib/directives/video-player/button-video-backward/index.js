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
        var playbackInterval;

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

        function backwardsSeek () {

            mediaElement.currentTime -= 1;
        }

        function normalPlayback () {

            clearInterval(playbackInterval);
            playbackInterval = null;
            mediaElement.playbackRate = 1.0;
        }

        function backwardPlayback () {

            if (!playbackInterval) {

                mediaElement.playbackRate = 0;
                playbackInterval = setInterval(backwardsSeek, 250);
            }
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

            button.removeEventListener('mouseup', onMouseUp);
            button.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        }

        return directive;
    }
]);

