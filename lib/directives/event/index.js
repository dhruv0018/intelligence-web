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
    'ROLES', 'SessionService', 'IndexingService', 'EventManager', 'EventEmitter', 'EVENT_MAP', 'PlaylistEventEmitter',
    function directive(ROLES, session, indexing, eventManager, emitter, EVENT_MAP, playlistEventEmitter) {

        var Event = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                play: '=',
                plays: '=',
                event: '=',
                league: '=',
                highlightedEventId: '=',
                autoAdvance: '=?'
            },

            link: link,

            controller: 'Event.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes, controller) {

            /* Track activated state of button. */
            let isButtonActive = false;

            var highlightButton = element.find('button');

            playlistEventEmitter.on('EVENT_CURRENT_CHANGE', onCurrentEventChange);

            element.on('$destroy', onDestroy);

            function onCurrentEventChange (currentEvent) {

                /* If the button is not active and the event is the current
                 * event, then activate the button. */
                if (isButtonActive === false && $scope.event === currentEvent) {

                    isButtonActive = true;
                    highlightButton.addClass('active');
                    element[0].scrollIntoView();

                /* If the button is active, then deactivate button. */
                } else if (isButtonActive === true && $scope.event !== currentEvent) {

                    highlightButton.removeClass('active');
                    isButtonActive = false;
                }
            }

            function onDestroy() {

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
Event.controller('Event.controller', [
    '$scope', '$q', 'ROLES', 'SessionService', 'IndexingService', 'TagsetsFactory', 'PlayersFactory', 'EventManager', 'PlayManager', 'GamesFactory', 'PlaylistEventEmitter',
    function controller($scope, $q, ROLES, session, indexing, tagsets, players, eventManager, playManager, games, playlistEventEmitter) {

        var tagId = $scope.event.tagId;
        var tagsetId = $scope.league.tagSetId;
        var tagset = tagsets.get(tagsetId);
        var tags = tagset.tags;
        var tag = tags[tagId];

        $scope.playManager = playManager;
        $scope.eventManager = eventManager;

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

        /* If the tag is a period tag, the advance the period. */
        if (tag.isPeriodTag) $scope.game.currentPeriod = ++$scope.play.period;

        $scope.$on('$destroy', function() {

            /* If the tag is a period tag, the unadvance the period. */
            if (tag.isPeriodTag) $scope.game.currentPeriod = --$scope.play.period;
        });

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
                    var teamRoster = $scope.game.getRoster(teamId);

                    /* If the player is on the team roster. */
                    // TODO: Use isActive attribute on playerInfo as well?
                    if (angular.isDefined(teamRoster.playerInfo[player.id])) {

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

        /**
        * Select an event to use as the current event.
        */
        $scope.selectEvent = function() {

            playlistEventEmitter.emit('EVENT_SELECT', $scope.event);
        };
    }
]);
