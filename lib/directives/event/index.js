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
    'ROLES',
    'SessionService',
    'EventManager',
    'PlaylistEventEmitter',
    function directive(
        ROLES,
        session,
        eventManager,
        playlistEventEmitter
    ) {

        var Event = {

            restrict: TO += ELEMENTS,

            replace: true,

            link: link,

            controller: EventController,
            controllerAs: 'eventController',
            templateUrl: templateUrl
        };

        function link($scope, element, attributes, controller) {

            /* Track activated state of button. */
            let isButtonActive = false;

            const isIndexer = session.currentUser.is(ROLES.INDEXER);

            /* Find button element. */
            const button = element[0].getElementsByTagName('button')[0];

            let currentEvent = eventManager.current;

            /* If event is the current event. */
            if ($scope.event === currentEvent) {

                onCurrentEventChange(currentEvent);
            }

            playlistEventEmitter.on('EVENT_CURRENT_CHANGE', onCurrentEventChange);

            element.on('$destroy', onDestroy);

            /**
             * @function
             * On select event.
             * @param event - the event selected
             */
            function onEventSelect (event) {

                requestAnimationFrame(scrollEventIntoView);
            }

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

                /* If event is the current event, then scroll it into view. */
                if ($scope.event === currentEvent) {

                    requestAnimationFrame(scrollEventIntoView);
                }
            }

            /**
             * @function
             * Scrolls the event element into view.
             */
            function scrollEventIntoView () {

                if (isIndexer) {

                    element[0].scrollIntoView();
                }
            }

            /**
             * @function
             * Activate the button
             * Switches the state flag for the button to active, adds an
             * "active" class to the button and scrolls the element into view.
             */
            function activateButton () {

                scrollEventIntoView();
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

                playlistEventEmitter.removeListener('EVENT_CURRENT_CHANGE', onCurrentEventChange);
            }
        }

        return Event;
    }
]);

EventController.$inject = [
    '$scope',
    'ROLES',
    'SessionService',
    'PlaylistEventEmitter'
];

/**
 * Event controller.
 * @module Event
 * @name EventController
 * @type {Controller}
 */
function EventController (
    $scope,
    ROLES,
    session,
    playlistEventEmitter
) {

    /* Build the items from the appropriate event script. */
    $scope.items = session.currentUser.is(ROLES.INDEXER) ? $scope.event.indexerScript : $scope.event.userScript;

    /**
     * Select an event to use as the current event.
     */
    $scope.selectEvent = function() {

        playlistEventEmitter.emit('EVENT_SELECT', $scope.event);
    };
}
