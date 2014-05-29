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
                roster: '=?',
                game: '=?'
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
    '$scope', '$state', '$localStorage', 'Coach.Game.Tabs', 'Coach.Data', 'PlayersFactory', 'TeamsFactory',
    function controller($scope, $state, $localStorage, tabs, data, players, teams) {

        $scope.tabs = tabs;
        $scope.gameRoster = [];
        $scope.gameRosterId = null;
        $scope.retrievedRoster = false;

        data.then(function(coachData) {
            $scope.data = coachData;
            $scope.positions = coachData.positionSet.indexedPositions;
        });


        $scope.$watch('game', function(game) {
            if (game.rosters && $scope.retrievedRoster === false) {
                players.getList({
                    roster: game.rosters[game.teamId].id
                }, function(gameRoster) {
                    $scope.gameRosterId = game.rosters[game.teamId].id;
                    //fresh game roster with only a single unknown player
                    if (gameRoster.length === 1) {
                        angular.forEach($scope.data.roster, function(teamRosterPlayer) {
                            if (teamRosterPlayer.rosterStatuses[$scope.data.rosterId.id]) {
                                teamRosterPlayer.rosterIds.push(game.rosters[game.teamId].id);
                                teamRosterPlayer.jerseyNumbers[game.rosters[game.teamId].id] = teamRosterPlayer.jerseyNumbers[$scope.data.rosterId.id];
                                teamRosterPlayer.positions[game.rosters[game.teamId].id] = teamRosterPlayer.positions[$scope.data.rosterId.id];
                                teamRosterPlayer.rosterStatuses[game.rosters[game.teamId].id] = true;
                                $scope.gameRoster.push(teamRosterPlayer);
                            }
                        });
                    } else {
                        $scope.gameRoster = gameRoster;
                    }
                    $scope.gameRoster = players.constructPositionDropdown($scope.gameRoster, $scope.gameRosterId, $scope.positions);
                    $scope.retrievedRoster = true;
                });
            }
        });

        $scope.$watch('formYourTeam.$invalid', function(invalid) {
            tabs['opposing-team'].disabled = invalid;
        });

        $scope.$watch('tabs["your-team"].disabled', function(disabled) {
            tabs['opposing-team'].disabled = disabled;
        });

        //TODO super dangerous, to discuss, putting the team roster here without a game roster id will start changing the team roster
//        $scope.$watch('roster', function(roster) {
//            console.log(roster);
//            if (roster.players) {
//                $scope.gameRoster = players.constructPositionDropdown(roster.players, $scope.gameRosterId, $scope.positions);
//            }
//        });

        $scope.save = function() {
            $scope.gameRoster = players.getPositionsFromDowndown($scope.gameRoster, $scope.gameRosterId, $scope.positions);
            players.save($scope.game.rosters[$scope.game.teamId].id, $scope.gameRoster);
            tabs.activateTab('opposing-team');
        };
    }
]);

