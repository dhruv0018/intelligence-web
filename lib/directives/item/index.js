/* Component dependencies */
require('gap');
require('text');
require('yard');
require('arena');
require('static');
require('dropdown');
require('formation');
require('passing-zone');
require('team-dropdown');
require('player-dropdown');
require('team-player-dropdown');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Item
 * @module Item
 */
var Item = angular.module('Item', [
    'ui.router',
    'ui.bootstrap',
    'Item.Gap',
    'Item.Text',
    'Item.Yard',
    'Item.Arena',
    'Item.Static',
    'Item.Dropdown',
    'Item.Formation',
    'Item.PassingZone',
    'Item.TeamDropdown',
    'Item.PlayerDropdown',
    'Item.TeamPlayerDropdown'
]);

/* Cache the template file */
Item.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Item directive.
 * @module Item
 * @name Item
 * @type {Directive}
 */
Item.directive('krossoverItem', [
    'ROLES', '$location', '$anchorScroll', 'SessionService', 'GamesFactory', 'TagsetsFactory',
    function directive(ROLES, $location, $anchorScroll, session, games, tagsets) {
        var Item = {

            restrict: TO += ELEMENTS,
            controller: 'ItemController',
            controllerAs: 'itemController',
            templateUrl: templateUrl
        };

        return Item;
    }
]);

/**
 * Item directive.
 * @module Item
 * @name Item
 * @type {Directive}
 */
Item.directive('krossoverSummaryItem', [
    'ROLES', '$location', '$anchorScroll', 'SessionService', 'GamesFactory', 'TagsetsFactory',
    function directive(ROLES, $location, $anchorScroll, session, games, tagsets) {
        var Item = {

            restrict: TO += ELEMENTS,
            scope: {
                item: '=',
                play: '=?',
                plays: '=?',
                event: '=',
                league: '=?',
                autoAdvance: '=?',
                game: '=?'
            },
            controller: 'ItemController',

            controllerAs: 'itemSummaryController',

            templateUrl: templateUrl
        };

        return Item;
    }
]);




Item.controller('ItemController', [
    '$scope',
    'ROLES',
    '$location',
    '$anchorScroll',
    'SessionService',
    'GamesFactory',
    'TagsetsFactory',
    'TeamsFactory',
    'PlayersFactory',
    'ZONES',
    'ZONE_IDS',
    'GAPS',
    'GAP_IDS',
    'PlayerlistManager',
    'ArenaModal.Modal',
    'ARENA_REGIONS_BY_ID',
    function ItemController($scope,
                            ROLES,
                            $location,
                            $anchorScroll,
                            session,
                            games,
                            tagsets,
                            teams,
                            players,
                            ZONES,
                            ZONE_IDS,
                            GAPS,
                            GAP_IDS,
                            playerlist,
                            ArenaModal,
                            ARENA_REGIONS_BY_ID) {
        var currentUser = session.currentUser;
        $scope.isCoach = currentUser.is(ROLES.COACH);
        $scope.isIndexer = currentUser.is(ROLES.INDEXER);
        $scope.variable = {
            value: undefined
        };
        $scope.isReset = false;

        /**
         * Determines if an item is editable
         * @param {Object} game - a game object
         * @return {Object} boolean - whether or not the item can be edited
         * EDIT RULES
         * User can edit if they are:
         * - An Indexer
         * - The Game Uploader (a.k.a 'Owner')
         * - A Coach on the uploader's team.
         */
        function canItemBeEdited(game) {
            if (!game) return false;

            var isIndexer = session.currentUser.is(ROLES.INDEXER);
            var isUploader = session.currentUser.id === game.uploaderUserId;
            var isTeamMember = session.getCurrentTeamId() === game.uploaderTeamId;
            var isACoachOfUploadersTeam = session.currentUser.is(ROLES.COACH) && isTeamMember;

            return (isIndexer || isUploader || isACoachOfUploadersTeam);
        }

        /**
         * initialized the variable values inside an event -- based on the item id
         * @param {Object} item - an item object
         * @param {Object} event - an event object
         */
        function initializeEventVariableValues(item, event) {
            if (!item || !item.id) return;
            if (!event || !event.variableValues) return;
            event.variableValues[item.id] = event.variableValues[item.id] || {};
            event.variableValues[item.id].type = event.variableValues[item.id].type || null;

            if (angular.isUndefined(event.variableValues[item.id].value) && !item.isRequired) {

                event.variableValues[item.id].value = null;
            }
        }

        /**
         * Determines the appropriate tag to use based on the event and the league
         * @param {Object} event
         * @param {Object} league
         * @returns {Object} tag
         */
        function getTag(event, league) {
            if (!event || !league) return null;
            var tagId = event.tagId;
            var tagsetId = league.tagSetId;
            var tagset = tagsets.get(tagsetId);
            var tags = tagset.tags;
            var tag = tags[tagId];
            return tag;
        }

        $scope.tag = getTag($scope.event, $scope.league);

        if ($scope.play && $scope.play.gameId) {
            $scope.game = games.get($scope.play.gameId);
        }

        // By default, editing an item is restricted
        $scope.isEditable = canItemBeEdited($scope.game);
        initializeEventVariableValues($scope.item, $scope.event);

        $scope.isString = function(item) {

            return angular.isString(item);
        };

        $scope.isUndefined = function(item) {

            return angular.isUndefined(item);
        };

        $scope.onChange = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index + 1;
            }
        };

        $scope.shouldFocus = function() {
            if ($scope.autoAdvance === true) {
                return $scope.event.activeEventVariableIndex == $scope.item.index;
            } else {
                return $scope.isReset;
            }
        };

        $scope.reset = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index;
            } else {
                $scope.event.activeEventVariableIndex = 0;
            }
            $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
            $scope.event.variableValues[$scope.item.id].value = undefined;
            $scope.isReset = true;
        };

        //todo note that player dropdown select doesnt work correctly without a timeout, however, that causes
        //a plethora of other issues
        $scope.onBlur = function() {
            $scope.isReset = false;

            switch($scope.item.type) {
                //todo imo still needs some cleaning up
                //would be nice to not have cases, but this will clean itself up in classes
                case 'TEXT':
                    if (!$scope.variable.value) {
                        $scope.resetItemValue();
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                    }
                    break;
                default:
                    if (!$scope.event.variableValues[$scope.item.id].value && $scope.isCoach) {
                        $scope.resetItemValue();
                    }
                    break;
            }
        };

        //todo a future item class method
        $scope.resetItemValue = function() {
            $scope.event.variableValues[$scope.item.id].value = ($scope.item.isRequired) ? $scope.previousValue : null;
        };

        /* Watch for variable value changes. */
        $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {
            if (angular.isUndefined(variableValue)) {
                $scope.variable.value = undefined;
            }

            if (variableValue === previousVariableValue) return;

            if ($scope.autoAdvance) return;

            /* If the variable value has been set. */
            if (variableValue) {

                /* If the play has been saved before. */
                if ($scope.play.id) {

                    /* Save the play. */
                    $scope.play.save()

                        .catch(function() {

                            $scope.play.error = true;
                        });
                }
            }
        });

        $scope.selectItem = function($item) {
            $scope.event.variableValues[$scope.item.id].value = $item.id;
            $scope.event.variableValues[$scope.item.id].type = $item.type;
        };

        //todo more item specific stuff to move into a class
        switch($scope.item.type) {
            //jumps to the next item (aka - tag variable -- which is a form field) after digits have been entered
            case 'YARD':
                $scope.$watch('variable.value', function(value) {

                    if (value && value.length > 1) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                        $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                    }
                });
                break;
            case 'PASSING_ZONE':
                $scope.ZONES = ZONES;
                $scope.ZONE_IDS = ZONE_IDS;
                break;
            case 'GAP':
                $scope.GAPS = GAPS;
                $scope.GAP_IDS = GAP_IDS;
                break;
            case 'DROPDOWN':
                $scope.options = ($scope.item && $scope.item.options) ? JSON.parse($scope.item.options) : [];
                break;
            case 'PLAYER_DROPDOWN':
                $scope.players = players.getCollection();
                $scope.playersList = playerlist.get();
                $scope.selectPlayer = function($item) {
                    $scope.event.variableValues[$scope.item.id].value = $item.id;
                };
                break;
            case 'TEAM_DROPDOWN':
                $scope.event.variableValues[$scope.item.id].type = 'Team';
                break;
            case 'PLAYER_TEAM_DROPDOWN':
                var team = teams.get($scope.game.teamId);
                var opposingTeam = teams.get($scope.game.opposingTeamId);

                $scope.teamRoster = $scope.game.getRoster(team.id);
                $scope.opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);
                $scope.players = players.getCollection();

                team.type = 'Team';
                opposingTeam.type = 'Team';
                $scope.teams = {};
                $scope.teams[team.id] = team;
                $scope.teams[opposingTeam.id] = opposingTeam;

                $scope.teamPlayerOptions = playerlist.get();
                $scope.teamPlayerOptions.push(team);
                $scope.teamPlayerOptions.push(opposingTeam);
                break;
            case 'ARENA':
                // Pass parent scope to child modal via modalOptions
                $scope.options = {scope: $scope};

                // Empty reference for parent scope
                $scope.coordinates = {};

                $scope.ARENA_REGIONS_BY_ID = ARENA_REGIONS_BY_ID;

                $scope.onBlur = function onBlur() {

                    $scope.isReset = false;
                    if (!$scope.variable.value) {
                        if ($scope.item.isRequired) {
                            $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                        } else {
                            $scope.event.variableValues[$scope.item.id].value = null;
                        }
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                    }

                    // Make sure to close the modal
                    $scope.closeArenaModal();
                };

                $scope.resetAndOpenModal = function resetAndOpenModal() {
                    $scope.reset();
                    $scope.openArenaModal();
                };

                // Reference to track if modal is open
                var arenaModalInstance = null;

                $scope.openArenaModal = function openArenaModal() {
                    $scope.isFocused = true;

                    $scope.variable.value = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                    arenaModalInstance = ArenaModal.open($scope.options);

                    arenaModalInstance.result.finally(function arenaModalPromiseHandler() {
                        $scope.onBlur();
                    });
                };

                $scope.closeArenaModal = function closeArenaModal() {

                    $scope.isFocused = false;

                    if (arenaModalInstance !== null) {
                        arenaModalInstance.close();
                        arenaModalInstance = null;
                    }
                };

                $scope.$watch('event.activeEventVariableIndex', function watchEventVariableIndex() {

                    // Use case: indexer presses enter or esc to navigate items, modal should close
                    if ($scope.autoAdvance === true) {

                        if ($scope.event.activeEventVariableIndex !== $scope.item.index && arenaModalInstance !== null) {

                            $scope.closeArenaModal();
                        }
                    }
                });
        }

        //todo not the best
        if ($scope.item.type === 'PLAYER_DROPDOWN' || $scope.item.type === 'TEAM_DROPDOWN' || $scope.item.type === 'PLAYER_TEAM_DROPDOWN') {
            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
            if ($scope.item.index === 1 && !$scope.autoAdvance) {
                $scope.$watch('event.variableValues[item.id].value', function (variableValue, previousVariableValue) {

                    // TODO: recalculate
                });

                $scope.$on('$destroy', function () {

                    // TODO: recalculate
                });
            }
        }
    }


]);
