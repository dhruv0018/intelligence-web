/* FIXME: Event variable should be renamed to avoid collision with native Event */
/*jshint -W079 */

/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

const EventTemplate = require('./template.html.js');

/**
 * Event
 * @module Event
 */
var Event = angular.module('Event', [
    'Item'
]);

krossoverEventHighlighting.$inject = [
    'EVENT',
    'EventManager',
    'PlaylistEventEmitter'
];

function krossoverEventHighlighting (
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

/**
 * Event Highlighting directive. Highlights the current event in the playlist.
 * @module Event
 * @name KrossoverEventHighlighting
 * @type {directive}
 */
Event.directive('krossoverEventHighlighting', krossoverEventHighlighting);

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
    'GamesFactory',
    'TeamsFactory',
    'PlaysFactory',
    function directive(
        $compile,
        $sce,
        EVENT,
        ROLES,
        session,
        eventManager,
        playlistEventEmitter,
        games,
        teams,
        plays
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


            /**
             * FIXME:
             * Why do I have to inject so many factories and fetch
             * so many resources just to know this information.
             * We should move some of this info further down onto
             * the entity models on construction
             */
            const playId = $scope.event.playId;
            const play = plays.get(playId);
            const game = games.get(play.gameId);
            const currentUser = session.getCurrentUser();
            const userIsCoach = currentUser.is(ROLES.COACH);
            const currentRole = session.getCurrentRole();
            const uploaderTeamId = game.uploaderTeamId;
            const userIsStaffOnUploadingTeam = userIsCoach && (currentRole.teamId === uploaderTeamId);

            compileTemplate();

            function compileTemplate(template) {

                if (!$scope.event) return;

                if (userIsStaffOnUploadingTeam) {

                    eventsHTMLString = $sce.trustAsHtml(EventTemplate);
                } else if (isIndexer) {

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

            $scope.selectEvent = selectEvent;

            /**
             * Select an event to use as the current event.
             */
            function selectEvent () {

                playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.SELECT, $scope.event);
                playlistEventEmitter.emit(EVENT.PLAYLIST.PLAY.SELECT, $scope.play);
            }

            /**
             * On a change in the current event.
             *
             * @function onCurrentEventChange
             * @param currentEvent - the current event
             */
            function onCurrentEventChange (currentEvent) {
                //used to recompile the script for the read only playlist as an indexer
                if (isIndexer && currentEvent === $scope.event) {

                    compileTemplate();
                }
            }

            function onDestroy () {

                playlistEventEmitter.removeListener(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, onCurrentEventChange);
            }
        }

        return Event;
    }
]);

/**
 * Event controller.
 * @module Event
 * @name EventController
 * @type {Controller}
 */
function EventController (
    $scope
) {

}

EventController.$inject = [
    '$scope'
];
