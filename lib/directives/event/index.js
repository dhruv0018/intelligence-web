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
    'PlaylistEventEmitter',
    function directive(playlistEventEmitter) {

        var Event = {

            restrict: TO += ELEMENTS,

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

            playlistEventEmitter.on('EVENT_CURRENT_CHANGE', onCurrentEventChange);

            /* TODO: Maybe use custom element destroy callback? */
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
                element[0].scrollIntoView();
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

            /* TODO: Maybe use custom element destroy callback? */
            function onDestroy () {

                playlistEventEmitter.removeListener('EVENT_CURRENT_CHANGE', onCurrentEventChange);
            }
        }

        return Event;
    }
]);

/**
 * Event controller.
 * @module Event
 * @name Event.controller
 * @type {controller}
 */
EventController.$inject = ['$scope', '$q', 'ROLES', 'SessionService', 'IndexingService', 'TagsetsFactory', 'PlayersFactory', 'EventManager', 'PlayManager', 'GamesFactory', 'PlaylistEventEmitter',];
function EventController($scope, $q, ROLES, session, indexing, tagsets, players, eventManager, playManager, games, playlistEventEmitter) {
    var tagId = $scope.event.tagId;
    var tagsetId = $scope.league.tagSetId;
    var tagset = tagsets.get(tagsetId);
    var tags = tagset.tags;
    var tag = tags[tagId];

    if ($scope.play) $scope.game = games.get($scope.play.gameId);

    /* Build the items from the appropriate event script. */
    $scope.items = session.currentUser.is(ROLES.INDEXER) ? tag.indexerScript : tag.userScript;

    /* An event is visible if it has a user script; a play is visible as
     * long as it has at least one visible event. */
    if (tag.userScript !== null) {
        $scope.play.hasVisibleEvents = true;
        if (!indexing.IS_INDEXING_STATE) {
            playManager.current = playManager.current || $scope.play;
            playManager.current.firstPlay = true;
        }
    }

    /* For any events that have a greater summary priority. */
    if (tag.summaryPriority > $scope.play.summary.priority) {

        /* Build the summary items from the event summary script. */
        var items = tag.summaryScript;

        /* Create a summary. */
        var summary = {

            priority: tag.summaryPriority,
            items: items,
            event: $scope.event
        };

        /* Add the summary to the play and the summaries on the play. */
        $scope.play.summary = summary;
        $scope.play.summaries.push(summary);
    }

    /**
     * Select an event to use as the current event.
     */
    $scope.selectEvent = function() {

        playlistEventEmitter.emit('EVENT_SELECT', $scope.event);
    };
}
