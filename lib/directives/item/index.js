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
    'PlaysManager',
    'PlaylistManager',
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
                            playsManager,
                            playlistManager,
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
        if ($scope.play && $scope.play.gameId) {
            $scope.game = games.get($scope.play.gameId);
        }

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

            if (!playlistManager.isEditable) return;

            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index;
            } else {
                $scope.event.activeEventVariableIndex = 0;
            }
            $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
            $scope.event.variableValues[$scope.item.id].value = undefined;
            $scope.isReset = true;

            //todo not the best
            if ($scope.item.type === 'ARENA') $scope.openArenaModal();
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
            $scope.determineResetButtonView($scope.variable.value);
        };

        //todo a future item class method
        $scope.resetItemValue = function() {
            $scope.event.variableValues[$scope.item.id].value = ($scope.item.isRequired) ? $scope.previousValue : null;
        };


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
            if ($scope.game) {
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

        //todo roll this into field class when it's ready
        //what appears on the reset button for items
        $scope.resetButton = {
            text: 'Optional',  //initial value
            meta: {} //to be used later for player display
        };


        //todo all of ths going away once the various playlist branches are merged together
        if ($scope.game) {
            var teamPlayers = $scope.game.getTeamPlayers();
            var opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
            var teamRoster = $scope.game.getRoster($scope.game.teamId);
            var opposingTeamRoster = $scope.game.getRoster($scope.game.opposingTeamId);
            var playersCollection = players.getCollection();
        }
        $scope.determineResetButtonView = function(value) {
            if ($scope.game) {
                switch($scope.item.type) {
                    case 'PASSING_ZONE':
                        $scope.resetButton.text = ZONES[ZONE_IDS[value]].name || 'Optional';
                        break;
                    case 'GAP':
                        $scope.resetButton.text = GAPS[GAP_IDS[value]].name || 'Optional';
                        break;
                    case 'FORMATION':
                        $scope.resetButton.text = $scope.item.formations[value].name || 'Optional';
                        break;
                    case 'PLAYER_DROPDOWN':
                        var isTeamPlayer = $scope.game.isPlayerOnTeam(value);
                        $scope.resetButton.meta.jerseyColor = isTeamPlayer ? $scope.game.primaryJerseyColor : $scope.game.opposingPrimaryJerseyColor;
                        $scope.resetButton.meta.jerseyNumber = (value === null) ? 'UN' : isTeamPlayer ?
                            teamRoster.playerInfo[value].jerseyNumber : opposingTeamRoster.playerInfo[value].jerseyNumber;
                        if (value !== null) {
                            var player = players.get(value);
                            $scope.resetButton.text = player.firstName + ' ' + player.lastName;
                        }

                        break;
                    case 'ARENA':
                        $scope.resetButton.text = (value && value.region) ? ARENA_REGIONS_BY_ID[value.region].description : 'Optional';
                        break;
                    default:
                        $scope.resetButton.text = value || 'Optional';
                        break;
                }
            }
        };

        //todo change to field value change watch at later date
        /* Watch for variable value changes. */
        const variableValueValueWatch = $scope.$watch('event.variableValues[item.id].value', onVariableValueValueChange);

        $scope.$on('$destroy', function() {

            variableValueValueWatch();

            if ($scope.item.index === 1) {

                playsManager.calculatePlays();
            }
        });

        //todo change to field value change at later date
        function onVariableValueValueChange(variableValue, previousVariableValue) {
            $scope.determineResetButtonView(variableValue);
            /* TODO: Fix autoAdvance. */
            if ($scope.autoAdvance) return;

            /* TODO: What to do with $scope.variable.value? */
            if (angular.isUndefined(variableValue)) {
                $scope.variable.value = undefined;
            }

            if (variableValue === previousVariableValue) return;

            /* If the variable value has been set. */
            if (variableValue) {

                /* If the play has been saved before. */
                if ($scope.play.id) {

                    /* Save the play. */
                    $scope.play.save();
                }
            }

            if ($scope.item.index === 1) {

                playsManager.calculatePlays();
            }
        }
    }
]);
