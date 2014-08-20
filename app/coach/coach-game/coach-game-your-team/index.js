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
    '$scope', '$state', 'PositionsetsFactory', 'PlayersFactory', 'TeamsFactory',
    function controller($scope, $state, positionsets, players, teams) {

        $scope.keys = window.Object.keys;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Game Roster for Coach Team
        $scope.gameRoster = [];

        //Positions
        $scope.positions = ($scope.data.league.positionSetId) ? positionsets.getCollection()[$scope.data.league.positionSetId].indexedPositions : {};

        $scope.$watchCollection('data.game', function(game) {
            $scope.buildGameRoster(game);
        });

        $scope.buildGameRoster = function(game) {
            //fresh game roster with only a single unknown player
            var templatePlayerList = angular.copy($scope.data.playersList);
            if (!$scope.data.gamePlayerLists[game.teamId] || $scope.data.gamePlayerLists[game.teamId].length <= 1) {
                $scope.gameRoster = [];
                angular.forEach(templatePlayerList, function(teamRosterPlayer) {
                    //if the player is active
                    if (teamRosterPlayer.rosterStatuses[$scope.teams[game.teamId].roster.id]) {
                        teamRosterPlayer.rosterIds.push(game.rosters[game.teamId].id);
                        teamRosterPlayer.jerseyNumbers[game.rosters[game.teamId].id] = teamRosterPlayer.jerseyNumbers[$scope.teams[game.teamId].roster.id];
                        if (Object.keys($scope.positions).length > 0) {
                            teamRosterPlayer.positions[game.rosters[game.teamId].id] = teamRosterPlayer.positions[$scope.teams[game.teamId].roster.id];
                        }
                        teamRosterPlayer.rosterStatuses[game.rosters[game.teamId].id] = true;
                        $scope.gameRoster.push(teamRosterPlayer);
                    }
                });
            } else {
                $scope.gameRoster = $scope.data.gamePlayerLists[game.teamId];
            }

            angular.forEach($scope.gameRoster, function(player) {
                player = players.constructPositionDropdown(player, game.rosters[game.teamId].id, $scope.positions);
            });
        };

        $scope.save = function() {

            if (Object.keys($scope.positions).length > 0) {
                angular.forEach($scope.gameRoster, function(player) {
                    player = players.getPositionsFromDowndown(player, $scope.data.game.rosters[$scope.data.game.teamId].id, $scope.positions);
                });
            }

            players.save($scope.data.game.rosters[$scope.data.game.teamId].id, $scope.gameRoster).then(function(roster) {
                $scope.gameRoster = roster;

                angular.forEach($scope.gameRoster, function(player) {
                    player = players.constructPositionDropdown(player, $scope.data.game.rosters[$scope.data.game.teamId].id, $scope.positions);
                });

                $scope.tabs.deactivateAll();
                $scope.tabs.opposing.active = true;
            });

        };
    }
]);

