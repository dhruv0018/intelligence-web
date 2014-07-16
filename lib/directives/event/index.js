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
                game: '=',
                play: '=',
                event: '=',
                league: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
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
    '$scope', '$q', 'ROLES', 'SessionService', 'IndexingService', 'TagsetsFactory', 'PlayersFactory', 'ScriptsService', 'EventManager', 'PlayManager',
    function controller($scope, $q, ROLES, session, indexing, tagsets, players, scripts, event, play) {

        var INDEXER = ROLES.INDEXER;
        var COACH = ROLES.COACH;

        var currentUser = session.currentUser;

        var tagId = $scope.event.tagId;
        var tagsetId = $scope.league.tagSetId;
        var tagset = tagsets.get(tagsetId);
        var tags = tagset.getIndexedTags();
        var tag = tags[tagId];

        /* An event is visible if it has a user script; a play is visible as
         * long as it has at least one visible event. */
        $scope.play.hasVisibleEvents = tag.userScript !== null;

        /* Build the items from the appropriate event script. */
        $scope.items = currentUser.is(INDEXER) ? scripts.indexerScript(tagset, $scope.event) : scripts.userScript(tagset, $scope.event);

        /* Set default play summary and priority. */
        $scope.play.summary = $scope.play.summary || {};
        $scope.play.summary.priority = $scope.play.summary.priority || 0;

        /* For any events that have a greater summary priority. */
        if (tag.summaryPriority > $scope.play.summary.priority) {

            /* Build the summary items from the event summary script. */
            var items = scripts.summaryScript(tagset, $scope.event);

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



                }


                }
            });
        }

        /**
        * Select an event to use as the current event.
        */
        $scope.selectEvent = function(selectedPlay, selectedEvent) {

            indexing.eventSelected = true;
            indexing.isIndexing = true;
            indexing.showTags = false;
            indexing.showScript = true;

            /* Set the current time to the time from the selected event. */
            $scope.videoplayer.pause();
            $scope.videoplayer.seekTime(selectedEvent.time);

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

