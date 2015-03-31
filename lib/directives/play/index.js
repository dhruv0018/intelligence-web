/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var templateUrl = 'play.html';

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
    'SessionService', 'ROLES', 'LeaguesFactory', 'GamesFactory', 'TeamsFactory', 'EventEmitter', 'EVENT_MAP', 'EventManager', 'PlayManager', 'CurrentEventMediator',
    function directive(session, ROLES, leagues, games, teams, emitter, EVENT_MAP, eventManager, playManager, currentEventMediator) {

        var Play = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            replace: false,

            scope: {
                play: '=',
                plays: '=?', // Only necessary for indexing
                reels: '=?',
                expandAll: '=?',
                isReelsPlay: '=?',
                filteredPlaysIds: '=?',
                autoAdvance: '=?',
                editFlag: '=?',
                index: '=?'
            },

            link: link,

            controller: 'Play.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.playElement = element;
            $scope.playsContainerElement = element.parent();

            var removeCurrentPlayWatch = $scope.$watch('playManager.current', currentPlayWatch);

            element.on('$destroy', onDestroy);

            function currentPlayWatch(currentPlay) {

                if ($scope.play === currentPlay) {

                    emitter.subscribe(EVENT_MAP.timeupdate, timeUpdateHandler);
                }

                else {

                    emitter.unsubscribe(EVENT_MAP.timeupdate, timeUpdateHandler);
                }
            }

            function onDestroy() {

                removeCurrentPlayWatch();
                emitter.unsubscribe(EVENT_MAP.timeupdate, timeUpdateHandler);
            }

            function timeUpdateHandler(e) {

                /* Get the video time. */
                var videoTime = e.detail.time;

                /* Push events to the mediator. */
                function pushToMediator(event) {

                    var eventTime = event.time - $scope.play.startTime;

                    /* If video time has not passed the event time. */
                    if (videoTime <= eventTime) {

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
