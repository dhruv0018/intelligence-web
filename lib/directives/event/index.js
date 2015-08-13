/* FIXME: Event variable should be renamed to avoid collision with native Event */
/*jshint -W079 */

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'event.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Event
 * @module Event
 */
var Event = angular.module('Event', [
    'Item'
]);

/* Cache the template file */
Event.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Event directive.
 * @module Event
 * @name Event
 * @type {directive}
 */
Event.directive('krossoverEvent', [
    '$compile',
    '$sce',
    'EVENT',
    'ROLES',
    'SessionService',
    'EventManager',
    'PlaylistEventEmitter',
    function directive(
        $compile,
        $sce,
        EVENT,
        ROLES,
        session,
        eventManager,
        playlistEventEmitter
    ) {

        var Event = {

            restrict: TO += ELEMENTS,

            scope: {
                isIndexer: '=',
                reel: '=?',
                play: '=',
                plays: '=',
                event: '=',
                league: '=',
                autoAdvance: '=?'
            },

            replace: true,

            link: link,

            controller: EventController,
            controllerAs: 'eventController'
        };

        function link($scope, element, attributes, controller) {

            let eventsHTMLString;

            compileScript();

            function compileScript() {

                if (!$scope.event) return;

                if ($scope.isIndexer) {

                    eventsHTMLString = $sce.trustAsHtml($scope.event.indexerHTML);
                } else {

                    eventsHTMLString = $sce.trustAsHtml($scope.event.userHTML);
                }

                /* Compile Template String */
                element.html(eventsHTMLString);
                $compile(element.contents())($scope);
            }

            /* Track activated state of button. */
            $scope.isButtonActive = false;

            let currentEvent = eventManager.current;

            /* If event is the current event. */
            if ($scope.event === currentEvent) {

                /* Handle the event change when creating element. */
                onCurrentEventChange(currentEvent);
            }

            playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, onCurrentEventChange);

            element.on('$destroy', onDestroy);

            /**
             * @function
             * On a change in the current event.
             * @param currentEvent - the current event
             */
            function onCurrentEventChange (currentEvent) {

                if ($scope.isIndexer) {

                    compileScript();
                }

                /* If the button is not active and the event is the current
                 * event, then activate the button. */
                if (!$scope.isButtonActive && $scope.event === currentEvent) {

                    $scope.isButtonActive = true;

                /* If the button is active, then deactivate button. */
                } else if ($scope.isButtonActive && $scope.event !== currentEvent) {

                    $scope.isButtonActive = false;
                }
            }

            function onDestroy () {

                playlistEventEmitter.removeListener(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, onCurrentEventChange);
            }
        }

        return Event;
    }
]);

EventController.$inject = [
    'EventManager',
    'EVENT',
    '$scope',
    'PlaylistEventEmitter'
];

/**
 * Event controller.
 * @module Event
 * @name EventController
 * @type {Controller}
 */
function EventController (
    eventManager,
    EVENT,
    $scope,
    playlistEventEmitter
) {

    /**
     * Select an event to use as the current event.
     */
    $scope.selectEvent = function() {

        playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.SELECT, $scope.event);
        playlistEventEmitter.emit(EVENT.PLAYLIST.PLAY.SELECT, $scope.play);
    };
}
