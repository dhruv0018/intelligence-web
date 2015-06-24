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
    'EVENT',
    'ROLES',
    'SessionService',
    'EventManager',
    'PlaylistEventEmitter',
    function directive(
        EVENT,
        ROLES,
        session,
        eventManager,
        playlistEventEmitter
    ) {

        var Event = {

            restrict: TO += ELEMENTS,

            scope: {
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
            controllerAs: 'eventController',
            templateUrl: templateUrl
        };

        function link($scope, element, attributes, controller) {

            /* Track activated state of button. */
            let isButtonActive = false;

            /* Find button element. */
            const button = element[0].getElementsByTagName('button')[0];

            let currentEvent = eventManager.current;

            /* Build the items from the appropriate event script. */
            $scope.items = session.currentUser.is(ROLES.INDEXER) ? $scope.event.indexerScript : $scope.event.userScript;

            /* Watch for changes in the event. */
            $scope.$watchCollection('event', event => {

                /* Build the items from the appropriate event script. */
                $scope.items = session.currentUser.is(ROLES.INDEXER) ? $scope.event.indexerScript : $scope.event.userScript;
            });

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

                /* If the button is not active and the event is the current
                 * event, then activate the button. */
                if (isButtonActive === false && $scope.event === currentEvent) {

                    requestAnimationFrame(activateButton);

                    /* If the button is active, then deactivate button. */
                } else if (isButtonActive === true && $scope.event !== currentEvent) {

                    requestAnimationFrame(deactivateButton);
                }
            }

            /**
             * @function
             * Activate the button
             * Switches the state flag for the button to active, adds an
             * "active" class to the button and scrolls the element into view.
             */
            function activateButton () {

                isButtonActive = true;
                button.classList.add('active');
            }

            /**
             * @function
             * Deactivate the button
             * Switches the state flag for the button to inactive and removes
             * the "active" class on the button.
             */
            function deactivateButton () {

                button.classList.remove('active');
                isButtonActive = false;
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

        eventManager.current = $scope.event;
        playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.SELECT, $scope.event);
    };
}
