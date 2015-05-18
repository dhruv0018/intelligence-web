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
var DIALOG_PARENT = 'videogular';

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
    'ArenaDialog.Service',
    '$mdDialog',
    'ARENA_REGIONS_BY_ID',
    'ARENA_TYPES',
    'ARENA_IDS',
    'LeaguesFactory',
    'VideoPlayer',
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
                            ArenaDialog,
                            $mdDialog,
                            ARENA_REGIONS_BY_ID,
                            ARENA_TYPES,
                            ARENA_IDS,
                            leagues,
                            videoPlayer) {

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

        $scope.reset = function($event) {

            if (!playlistManager.isEditable) return;

            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index;
            } else {
                $scope.event.activeEventVariableIndex = 0;
            }
            $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;

            if ($scope.item.type !== 'ARENA')
                $scope.event.variableValues[$scope.item.id].value = undefined;

            $scope.isReset = true;

            //todo not the best
            if ($scope.item.type === 'ARENA') $scope.openArenaDialog($event);
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
                    if (!$scope.event.variableValues[$scope.item.id].value) {
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

        /* Arena Item specific data */
        let modalOptions = null;

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
                $scope.event.variableValues[$scope.item.id].type = 'Player';
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

                /* Options for arena modal */
                let teamId = $scope.game.teamId;
                let leagueId = teams.get(teamId).leagueId;
                let league = leagues.get(leagueId);
                let arenaId = league.arenaId;
                let size = ARENA_TYPES[arenaId].size;
                modalOptions = {scope: $scope, size: size};

                /* Scope for arena modal */
                $scope.onVariableValueValueChange = onVariableValueValueChange;
                $scope.league = league;
                $scope.onArenaBlur = onArenaBlur;

                /* Scope for template */
                $scope.openArenaDialog = openArenaDialog;

                // Reference for open arena dialog
                var arenaDialogPromise = null;

                $scope.$on('$destroy', onItemDestroy);

                break;
        }

        function onItemDestroy() {

            closeArenaDialog();
        }

        /* Begin arena controller methods */


        function onArenaBlur() {

            $scope.isReset = false;

            if (!$scope.event.variableValues[$scope.item.id].value) {

                $scope.event.variableValues[$scope.item.id].value = $scope.item.isRequired ? $scope.previousValue : null;
            }

            // Make sure to close the modal
            closeArenaDialog();
        }

        function openArenaDialog(event) {

            let parentElement;

            $scope.isFocused = true;

            if ($scope.event.variableValues[$scope.item.id].value === null) {

                $scope.event.variableValues[$scope.item.id].value = undefined;
            }

            //The dialog box will append to the parent element if in fullscreen mode
            if(videoPlayer.isFullScreen || document.fullscreenEnabled){
                parentElement = DIALOG_PARENT;
            }

            /** If parentEl is null when passed to ArenaDialog,
             *  it will be appended to the body as normal
             */
            arenaDialogPromise = ArenaDialog.show(event, $scope.item, $scope.league, parentElement);

            arenaDialogPromise.then(
                arenaDialogConfirm
            );
        }

        function arenaDialogConfirm() {

            $scope.onArenaBlur();
        }

        function closeArenaDialog() {

            $scope.isFocused = false;

            if (arenaDialogPromise) {

                $mdDialog.hide(arenaDialogPromise);

                arenaDialogPromise = null;
            }
        }

        /* End arena modal controller methods */

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
            var reelPlayerList = []; //right now we don't need to fill in the playerlist for reels
            var teamPlayers = ($scope.reel) ? reelPlayerList : $scope.game.getTeamPlayers();
            var opposingTeamPlayers = ($scope.reel) ? reelPlayerList : $scope.game.getOpposingTeamPlayers();
            var teamRoster = $scope.game.getRoster($scope.game.teamId);
            var opposingTeamRoster = $scope.game.getRoster($scope.game.opposingTeamId);
            var playersCollection = players.getCollection();
        }
        $scope.determineResetButtonView = function(value) {
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
                        if (value) $scope.constructPlayerButtonView(value);
                        break;
                    case 'TEAM_DROPDOWN':
                        //casting to make sure that the values are the same type
                        $scope.resetButton.text = (value === null) ? 'Optional' : (+value === +$scope.team.id) ? $scope.team.name : $scope.opposingTeam.name;
                        break;
                    case 'ARENA':
                        $scope.resetButton.text = (value && value.region.id) ? ARENA_REGIONS_BY_ID[value.region.id].description : 'at shot location';
                        break;
                    case 'PLAYER_TEAM_DROPDOWN':
                        //todo figure this out
                        let variable = $scope.event.variableValues[$scope.item.id];
                        if (!variable.isRequired && variable.value === null) {
                            $scope.resetButton.text = 'Optional';
                        } else if (variable.type === 'Team' && value) {
                            $scope.resetButton.text = $scope.teams[value].name;
                        } else if (variable.type === 'Player' && value) {
                            $scope.constructPlayerButtonView(value);
                        } else {
                            $scope.resetButton.text = 'Select';
                        }

                        break;
                    default:
                        $scope.resetButton.text = value || 'Optional';
                        break;
                }
        };

        //todo will certainly be a class method in the future
        $scope.constructPlayerButtonView = function constructPlayerButtonView(value) {
            var isTeamPlayer = value ? $scope.game.isPlayerOnTeam(value) : false;
            //todo players who dont have jersey numbers are listed without anything there
            var unlistedPlayerJersey = '';
            $scope.resetButton.meta.jerseyColor = isTeamPlayer ? $scope.game.primaryJerseyColor : $scope.game.opposingPrimaryJerseyColor;
            if (value !== null && value !== undefined) {
                var player = players.get(value);
                $scope.resetButton.text = player.firstName + ' ' + player.lastName;
                switch(isTeamPlayer) {
                    case true:
                        $scope.resetButton.meta.jerseyNumber = teamRoster.playerInfo[value].jerseyNumber ? teamRoster.playerInfo[value].jerseyNumber :unlistedPlayerJersey;
                        break;
                    case false:
                        $scope.resetButton.meta.jerseyNumber = opposingTeamRoster.playerInfo[value].jerseyNumber ? opposingTeamRoster.playerInfo[value].jerseyNumber : unlistedPlayerJersey;
                        break;
                }
            } else {
                $scope.resetButton.meta.jerseyNumber = unlistedPlayerJersey;
            }
        };

        //todo change to field value change watch at later date
        /* Watch for variable value changes. */
        const variableValueValueWatch = $scope.$watchCollection('event.variableValues[item.id].value', onVariableValueValueChange);

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
