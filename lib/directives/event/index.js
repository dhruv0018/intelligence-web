/* FIXME: Event variable should be renamed to avoid collision with native Event */
/*jshint -W079 */

/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

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

krossoverEventActive.$inject = [
    'EVENT',
    'EventManager',
    'PlaylistEventEmitter'
];

function krossoverEventActive (
    EVENT,
    eventManager,
    playlistEventEmitter
) {

    const definition = {

        restrict: TO += ATTRIBUTES,
        link
    };

    function link (scope, element) {

        /* Track activated state of button. */
        let isButtonActive = false;
        const button       = element[0];

        /* If event is the current event. */
        let currentEvent = eventManager.current;

        if (scope.event === currentEvent) {

            /* Handle the event change when creating element. */
            onCurrentEventChange(currentEvent);
        }

        playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, onCurrentEventChange);
        element.on('$destroy', onDestroy);

        /**
         * On a change in the current event.
         *
         * @function onCurrentEventChange
         * @param currentEvent - the current event
         */
        function onCurrentEventChange (currentEvent) {

            /* If the button is not active and the event is the current
             * event, then activate the button. */
            if (!isButtonActive && scope.event === currentEvent) {

                requestAnimationFrame(activateButton);

            /* If the button is active, then deactivate button. */
            } else if (isButtonActive && scope.event !== currentEvent) {

                requestAnimationFrame(deactivateButton);
            }
        }

        /**
         * Activate the button
         * Switches the state flag for the button to active, adds an
         * "active" class to the button and scrolls the element into view.
         *
         * @function activateButton
         */
        function activateButton () {

            isButtonActive = true;
            button.classList.add('active');
        }

        /**
         * Deactivate the button
         * Switches the state flag for the button to inactive and removes
         * the "active" class on the button.
         *
         * @function deactivateButton
         */
        function deactivateButton () {

            button.classList.remove('active');
            isButtonActive = false;
        }

        /**
         * Remove handlers when directive is destroyed.
         *
         * @function onDestroy
         */
        function onDestroy () {

            playlistEventEmitter.removeListener(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, onCurrentEventChange);
        }
    }

    return definition;
}

Event.directive('krossoverEventActive', krossoverEventActive);

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

                play: '=',
                event: '=',
            },

            replace: true,

            link: link,

            controller: EventController,
            controllerAs: 'eventController'
        };

        function link($scope, element, attributes, controller) {
            let isIndexer = session.currentUser.is(ROLES.INDEXER);
            let eventsHTMLString;

            compileScript();

            function compileScript() {

                if (!$scope.event) return;

                if (isIndexer) {

                    eventsHTMLString = $sce.trustAsHtml($scope.event.indexerHTML);
                } else {

                    eventsHTMLString = $sce.trustAsHtml($scope.event.userHTML);
                }

                /* Compile Template String */
                element.html(eventsHTMLString);
                $compile(element.contents())($scope);
            }

            playlistEventEmitter.on(EVENT.INDEXING.EVENT.COMPLETE, onCurrentEventChange);
            element.on('$destroy', onDestroy);

            /**
             * On a change in the current event.
             *
             * @function onCurrentEventChange
             * @param currentEvent - the current event
             */
            function onCurrentEventChange (currentEvent) {

                if (isIndexer && currentEvent === $scope.event) {

                    compileScript();
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
