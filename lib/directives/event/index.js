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
                plays: '=',
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

            //update own highlighting when the time is right
            $scope.$watch(function() {
                return event.highlighted;
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

            /* Set default play summary and priority. */
            $scope.play.summary = $scope.play.summary || {};
            $scope.play.summary.priority = $scope.play.summary.priority || 0;
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
    '$scope', '$q', 'ROLES', 'SessionService', 'IndexingService', 'TagsetsFactory', 'PlayersFactory', 'ScriptsService', 'EventManager', 'PlayManager', 'VideoPlayerInstance', 'VG_EVENTS',
    function controller($scope, $q, ROLES, session, indexing, tagsets, players, scripts, eventManager, playManager, videoplayer, VG_EVENTS) {

        var tagId = $scope.event.tagId;
        var tagsetId = $scope.league.tagSetId;
        var tagset = tagsets.get(tagsetId);
        var tags = tagset.getIndexedTags();
        var tag = tags[tagId];

        $scope.eventManager = eventManager;

        /* Build the items from the appropriate event script. */
        $scope.items = session.currentUser.is(ROLES.INDEXER) ? scripts.indexerScript(tagset, $scope.event) : scripts.userScript(tagset, $scope.event);

        /* An event is visible if it has a user script; a play is visible as
         * long as it has at least one visible event. */
        $scope.play.hasVisibleEvents = tag.userScript !== null;

        /* If the tag is a period tag, the advance the period. */
        if (tag.isPeriodTag) $scope.game.currentPeriod = ++$scope.play.period;

        $scope.$on('$destroy', function() {

            /* If the tag is a period tag, the unadvance the period. */
            if (tag.isPeriodTag) $scope.game.currentPeriod = --$scope.play.period;
        });

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

        /* Set the play possession is not already set. */
        if (!$scope.play.possessionTeamId) {

            var variableValues = $scope.event.variableValues;

            /* Step through each tag variable in order. */
            for (var index = 1; tag.tagVariables[index]; index++) {

                /* Lookup the tag variable. */
                var tagVariable = tag.tagVariables[index];

                /* Lookup the variable value. */
                var variableValue = variableValues[tagVariable.id];

                /* if the variable value is a team. */
                if (variableValue && variableValue.type === 'Team') {

                    /* The value of the variable is a team ID. */
                    $scope.play.possessionTeamId = variableValue.value;

                    break;
                }

                /* if the variable value is a player. */
                else if (variableValue && variableValue.type === 'Player') {

                    /* The value of the variable is a player ID. */
                    var playerId = variableValue.value;

                    /* Get the player. */
                    var player = players.get(playerId);

                    /* Get the team ID. */
                    var teamId = $scope.game.teamId;

                    /* Get the team roster Id. */
                    var teamRosterId = $scope.game.rosters[teamId].id;

                    /* If the player is on the team roster. */
                    if (~player.rosterIds.indexOf(teamRosterId)) {

                        /* Set possession to the team ID. */
                        $scope.play.possessionTeamId = $scope.game.teamId;
                    }

                    /* If the player is not on the team roster, assume they are
                     * on the opposing team roster. */
                    else {

                        /* Set possession to the opposing team ID. */
                        $scope.play.possessionTeamId = $scope.game.opposingTeamId;
                    }

                    break;
                }
            }
        }

        //set this event to the highlighted event if the clip time corresponds to its time
        videoplayer.then(function(vp) {
            vp.$on(VG_EVENTS.ON_UPDATE_TIME, function(eventTarget, timeParams) {
                event.highlighted = event.highlighted || {time: 0};
                if (timeParams[0] - $scope.event.time > 0) {
                    if ($scope.event.time > event.highlighted.time) {
                        event.highlighted = $scope.event;
                    }
                }
            });
        });

        /**
        * Select an event to use as the current event.
        */
        $scope.selectEvent = function() {

            indexing.eventSelected = true;
            indexing.isIndexing = true;
            indexing.showTags = false;
            indexing.showScript = true;

            /* Set the current time to the time from the selected event. */
            videoplayer.then(function(vp) {
                vp.seekTime(selectedEvent.time);
                vp.play();
            });

            /* Set the current play and event to match the selected event. */
            playManager.current = selectedPlay;
            eventManager.current = selectedEvent;
            eventManager.highlighted = selectedEvent;
        };
    }
]);

