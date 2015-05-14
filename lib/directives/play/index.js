/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var templateUrl = 'play.html';

require('play-header');
require('play-footer');

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play', [
    'Events',
    'PlayHeader',
    'PlayFooter',
    'ui.bootstrap'
]);

/* Cache the template file */
Play.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Play directive.
 * @module Play
 * @name Play
 * @type {directive}
 */
Play.directive('krossoverPlay', [
    '$timeout',
    'PlayManager',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS',
    'CurrentEventMediator',
    function directive(
        $timeout,
        playManager,
        VideoPlayerEventEmitter,
        VIDEO_PLAYER_EVENTS,
        currentEventMediator
    ) {

        var Play = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            link: link,

            controller: 'Play.controller',
            controllerAs: 'playController',
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.playElement = element;
            $scope.playsContainerElement = element.parent();

            var currentPlayWatch = $scope.$watch('playManager.current', onCurrentPlay);

            element.on('$destroy', onDestroy);

            function scrollPlayIntoView () {

                element[0].scrollIntoView();
            }

            function onCurrentPlay(currentPlay) {

                if ($scope.play === currentPlay) {

                    $timeout(scrollPlayIntoView, 0, false);

                    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, timeUpdateHandler);

                } else {

                    VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, timeUpdateHandler);
                }
            }

            function onDestroy() {

                /* Remove $watch on playManager.current */
                currentPlayWatch();

                VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, timeUpdateHandler);
            }

            function timeUpdateHandler(event) {

                /* Get the video time. */
                let videoTime = event.target.currentTime;

                /* Push events to the mediator. */
                function pushToMediator(event) {

                    let eventTime = event.time - $scope.play.startTime;

                    /* If video time has not passed the event time. */
                    if (eventTime <= videoTime) {

                        /* Push the event to the mediator. */
                        currentEventMediator.push(event);
                    }
                }

                /* Add events to the current event mediator. */
                $scope.play.events.forEach(pushToMediator);

                /* Flush the current event mediator to find the current event. */
                currentEventMediator.flush();
            }
        }

        return Play;
    }
]);

/* File Dependencies */
require('./controller');
