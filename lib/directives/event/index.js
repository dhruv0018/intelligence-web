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
    'ROLES', 'SessionService', 'IndexingService', 'EventManager',
    function directive(ROLES, session, indexing, event) {

        var Event = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                play: '=',
                event: '=',
                league: '=',
                videoplayer: '='
            },

            link: link,

            controller: 'Event.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            //update own highlighting when the time is right
            $scope.$watch(function() {
                return event.hightlighted;
            }, function(newHighlightedEvent) {

                var highlightButton;
                var highlightButtonList = element.find('button');

                for (var i = 0; i < highlightButtonList.length; i++) {
                    if (highlightButtonList.eq(i).hasClass('btn-select-event')) {
                        highlightButton = highlightButtonList.eq(i);
                    }
                }

                //is this event supposed to be the highlighted one?
                if ($scope.event === newHighlightedEvent) {
                    if (highlightButton) highlightButton.addClass('active');
                } else {
                    if (highlightButton) highlightButton.removeClass('active');
                }
            });
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
Event.controller('Event.controller', [
    '$scope', '$q', 'ROLES', 'SessionService', 'IndexingService', 'TagsetsFactory', 'ScriptsService', 'EventManager', 'PlayManager', 'VideoPlayerInstance', 'VG_EVENTS',
    function controller($scope, $q, ROLES, session, indexing, tagsets, scripts, event, play, videoplayer, VG_EVENTS) {

        var INDEXER = ROLES.INDEXER;
        var COACH = ROLES.COACH;

        var currentUser = session.currentUser;

        $scope.$watch('league.tagSetId', function(tagSetId) {

            if (tagSetId) {

                if (!tagsets.collection) throw new Error('Tagsets collection not initialized');

                var tagset = tagsets.collection[tagSetId];

                if (currentUser.is(INDEXER)) {

                    $scope.items = scripts.indexerScript(tagset, $scope.event);
                }

                else {

                    $scope.items = scripts.userScript(tagset, $scope.event);
                }
            }
        });

        //set this event to the highlighted event if the clip time corresponds to its time
        videoplayer.then(function(vp) {
            vp.$on(VG_EVENTS.ON_UPDATE_TIME, function(eventTarget, timeParams) {
                event.hightlighted = event.hightlighted || {time: 0};
                if (timeParams[0] - $scope.event.time > 0) {
                    if ($scope.event.time > event.hightlighted.time) {
                        event.hightlighted = $scope.event;
                    }
                }
            });
        });

        /**
        * Select an event to use as the current event.
        */
        $scope.selectEvent = function(selectedPlay, selectedEvent) {

            indexing.eventSelected = true;
            indexing.isIndexing = true;
            indexing.showTags = false;
            indexing.showScript = true;

            /* Set the current time to the time from the selected event. */
            videoplayer.then(function(vp) {
                vp.pause();
                vp.seekTime(selectedEvent.time);
            });

            /* Set the current play and event to match the selected event. */
            play.current = selectedPlay;
            event.current = selectedEvent;
            event.hightlighted = selectedEvent;
        };
    }
]);

