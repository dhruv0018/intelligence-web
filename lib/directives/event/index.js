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

        //console.log(videoplayer);
        videoplayer.then(function(vp) {
            //console.log('vpAPI...', vp);
            vp.$on(VG_EVENTS.ON_UPDATE_TIME, function(eventTarget, timeParams) {
                console.log('sevt', timeParams[0], $scope.event.time, timeParams[0] - $scope.event.time);
                if (timeParams[0] - $scope.event.time > 0 && timeParams[0] - $scope.event.time < 2) {
                    event.current = $scope.event;
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

            console.log('SELECT EVENT', selectedPlay, selectedEvent);
            /* Set the current time to the time from the selected event. */
            videoplayer.then(function(vp) {
                vp.pause();
                vp.seekTime(selectedEvent.time);
            });

            /* Set the current play and event to match the selected event. */
            play.current = selectedPlay;
            event.current = selectedEvent;
        };

        $scope.$watch(function() {

            if (event && event.current) {

                return event.current.id;
            }

        }, function(currentEventId) {

            $scope.currentEventId = currentEventId;
        });
    }
]);

