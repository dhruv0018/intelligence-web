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
                data: '='
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
    '$scope', '$state', '$localStorage', 'Coach.Game.Tabs', 'PlayersFactory', 'TeamsFactory',
    function controller($scope, $state, $localStorage, tabs, players, teams) {
        console.log('working');
        $scope.tabs = tabs;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Game Roster for Coach Team
        $scope.gameRoster = [];

        //Positions
        $scope.positions = $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions;
        console.log($scope.positions);
//        $scope.gameRosterId = null;
//        $scope.retrievedRoster = false;
//
//        data.then(function(coachData) {
//            $scope.data = coachData;
//            $scope.positions = coachData.positionSet.indexedPositions;
//        });
//
//
        $scope.$watch('data.game', function(game) {
//            if (game.rosters && $scope.retrievedRoster === false) {
//                players.getList({
//                    roster: game.rosters[game.teamId].id
//                }, function(gameRoster) {
//                    $scope.gameRosterId = game.rosters[game.teamId].id;
//                    //fresh game roster with only a single unknown player
//                    if (gameRoster.length === 1) {
//                        angular.forEach($scope.data.roster, function(teamRosterPlayer) {
//                            if (teamRosterPlayer.rosterStatuses[$scope.data.rosterId.id]) {
//                                teamRosterPlayer.rosterIds.push(game.rosters[game.teamId].id);
//                                teamRosterPlayer.jerseyNumbers[game.rosters[game.teamId].id] = teamRosterPlayer.jerseyNumbers[$scope.data.rosterId.id];
//                                teamRosterPlayer.positions[game.rosters[game.teamId].id] = teamRosterPlayer.positions[$scope.data.rosterId.id];
//                                teamRosterPlayer.rosterStatuses[game.rosters[game.teamId].id] = true;
//                                $scope.gameRoster.push(teamRosterPlayer);
//                            }
//                        });
//                    } else {
//                        $scope.gameRoster = gameRoster;
//                    }
//                    angular.forEach($scope.gameRoster, function(player) {
//                        player = players.constructPositionDropdown(player, $scope.gameRosterId, $scope.positions);
//                    });
//                    $scope.retrievedRoster = true;
//                });
//            }
            console.log('game changer');
            console.log($scope.data);
            console.log($scope.positions);

            //fresh game roster with only a single unknown player
            if ($scope.data.gamePlayerLists[game.teamId].length === 1) {
                angular.forEach($scope.data.playersList, function(teamRosterPlayer) {
                    //if the player is active
                    //TODO, NOTE: We need team rosters to be created automatically on team creation
                    //otherwise this step is really annoying to check
                    if (teamRosterPlayer.rosterStatuses[$scope.teams[game.teamId].roster.id]) {
                        teamRosterPlayer.rosterIds.push(game.rosters[game.teamId].id);
                        teamRosterPlayer.jerseyNumbers[game.rosters[game.teamId].id] = teamRosterPlayer.jerseyNumbers[$scope.teams[game.teamId].roster.id];
                        teamRosterPlayer.positions[game.rosters[game.teamId].id] = teamRosterPlayer.positions[$scope.teams[game.teamId].roster.id];
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

        });

        $scope.$watch('tabs["your-team"].disabled', function(disabled) {
            tabs['opposing-team'].disabled = disabled;
        });

        $scope.save = function() {

            angular.forEach($scope.gameRoster, function(player) {
                player = players.getPositionsFromDowndown(player, $scope.data.game.rosters[$scope.data.game.teamId].id, $scope.positions);
            });

            players.save($scope.data.game.rosters[$scope.data.game.teamId].id, $scope.gameRoster).then(function(roster) {
                console.log(roster);
                $scope.gameRoster = roster;

                angular.forEach($scope.gameRoster, function(player) {
                    player = players.constructPositionDropdown(player, $scope.data.game.rosters[$scope.data.game.teamId].id, $scope.positions);
                });

                //tabs.activateTab('opposing-team');
            });

        };
    }
]);

