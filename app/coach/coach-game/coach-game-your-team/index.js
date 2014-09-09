/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/your-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module YourTeam
 */
var YourTeam = angular.module('Coach.Game.YourTeam', []);

/* Cache the template file */
YourTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * YourTeam directive.
 * @module YourTeam
 * @name YourTeam
 * @type {directive}
 */
YourTeam.directive('krossoverCoachGameYourTeam', [
    function directive() {

        var krossoverCoachGameYourTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.YourTeam.controller',

            scope: {
                data: '=',
                tabs: '='
            }
        };

        return krossoverCoachGameYourTeam;
    }
]);
/**
 * YourTeam controller.
 * @module YourTeam
 * @name YourTeam
 * @type {controller}
 */
YourTeam.controller('Coach.Game.YourTeam.controller', [
    '$scope', '$state', 'PlayersFactory', 'TeamsFactory',
    function controller($scope, $state, players, teams) {

        //TODO: temporary fix of tabs flow
        function enableAllTabs() {
            $scope.loading = false;
            $scope.tabs.scouting.disabled = false;
            $scope.tabs.opposing.disabled = false;
            $scope.tabs.team.disabled = false;
            $scope.tabs.confirm.disabled = false;
        }

        $scope.keys = window.Object.keys;

        //fresh roster
        var templatePlayerList = angular.copy($scope.data.playersList);

        //Make sure team has roster
        $scope.hasRoster = false;
        $scope.loading = true;
        $scope.saving = false;

        $scope.returnToGameAlert = function() {
            // alerts.add({
            //     type: ALERT_TYPES.SUPER_DANGER,
            //     message: 'Once you upload your roster, click here to return to your uploaded game and submit for breakdown.',
            //     mode: ALERT_MODES.PERSISTENT
            // });
        };

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Game Roster for Coach Team
        $scope.gameRoster = [];

        //Positions
        $scope.positions = ($scope.data.league.positionSetId) ? $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions : {};
        $scope.$watchCollection('data.game', function(game) {
            //gets rid of inactive players
            templatePlayerList = templatePlayerList.filter(function(teamRosterPlayer) {
                return teamRosterPlayer.rosterStatuses[$scope.teams[game.teamId].roster.id];
            });
            $scope.loading = (templatePlayerList.length > 0);
            $scope.buildGameRoster(game);
        });

        $scope.buildGameRoster = function(game) {

            if (!$scope.data.gamePlayerLists) return;

            if (!$scope.data.gamePlayerLists[game.teamId] || $scope.data.gamePlayerLists[game.teamId].length <= 1) {
                $scope.gameRoster = [];
                angular.forEach(templatePlayerList, function(teamRosterPlayer) {
                    //if the player is active
                    if (teamRosterPlayer.rosterStatuses[$scope.teams[game.teamId].roster.id]) {
                        teamRosterPlayer.rosterIds.push(game.rosters[game.teamId].id);
                        teamRosterPlayer.jerseyNumbers[game.rosters[game.teamId].id] = teamRosterPlayer.jerseyNumbers[$scope.teams[game.teamId].roster.id];
                        if (Object.keys($scope.positions).length > 0) {
                            teamRosterPlayer.positionIds[game.rosters[game.teamId].id] = teamRosterPlayer.positionIds[$scope.teams[game.teamId].roster.id];
                        }
                        teamRosterPlayer.rosterStatuses[game.rosters[game.teamId].id] = true;
                        $scope.gameRoster.push(teamRosterPlayer);
                    }
                });

                players.save($scope.data.game.rosters[$scope.data.game.teamId].id, $scope.gameRoster).then(function(roster) {
                    $scope.gameRoster = roster;
                });
            } else {
                $scope.gameRoster = $scope.data.gamePlayerLists[game.teamId];
            }
        };

        $scope.$watch('gameRoster', function(gameRoster) {

            if ($scope.gameRoster && $scope.gameRoster.some(function(player) { return !player.isUnknown; })) {
                $scope.hasRoster = true;
                enableAllTabs();
                $scope.data.gamePlayerLists[$scope.data.game.teamId] = $scope.gameRoster;
            }
        }, true);

        $scope.save = function() {
            $scope.data.gamePlayerLists[$scope.data.game.teamId] = $scope.gameRoster;
            players.save($scope.data.game.rosters[$scope.data.game.teamId].id, $scope.gameRoster).then(function(roster) {
                $scope.gameRoster = roster;

                $scope.tabs.deactivateAll();
                $scope.tabs.opposing.active = true;
            });

        };
    }
]);

