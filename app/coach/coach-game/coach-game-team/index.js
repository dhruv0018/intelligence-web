/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module OpposingTeam
 */
var Team = angular.module('Coach.Game.Team', []);

/* Cache the template file */
Team.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Team directive.
 * @module Team
 * @name Team
 * @type {directive}
 */
Team.directive('krossoverCoachGameTeam', [
    function directive() {

        var krossoverCoachGameTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Team.controller',
            scope: {
                game: '=?',
                scoutingRoster: '=?'
            }
        };

        return krossoverCoachGameTeam;
    }
]);

/**
 * Team controller.
 * @module Team
 * @name Team
 * @type {controller}
 */
Team.controller('Coach.Game.Team.controller', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'Coach.Game.Tabs', 'Coach.Game.Data', 'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, tabs, data, games, players) {
        console.log('working scrimmage team');
//        $scope.tabs = tabs;
//        $scope.data = {};
//
//        data.then(function(coachData) {
//            $scope.data = coachData;
//            $scope.positions = coachData.positionSet.indexedPositions;
//
//            if (coachData.opposingTeamGameRoster) {
//                $scope.data.opposingTeam = {
//                    players: coachData.opposingTeamGameRoster.players || []
//                };
//                $scope.data.opposingTeam.players = players.constructPositionDropdown(coachData.opposingTeamGameRoster.players, coachData.game.rosters[coachData.game.opposingTeamId].id, $scope.positions);
//            }
//            console.log($scope.positions);
//        });
//
//        $scope.$watch('game', function(game) {
//            if (game.rosters) {
//                $scope.opposingTeamRosterId = game.rosters[game.opposingTeamId].id;
//            }
//        });
//
//        $scope.$watch('data.opposingTeam.players', function(opposingTeamRoster) {
//            if (typeof opposingTeamRoster !== 'undefined') {
//                if (opposingTeamRoster.length === 0) {
//                    $scope.addNewPlayer();
//                }
//            } else {
//                $scope.data.opposingTeam = {
//                    players: []
//                };
//            }
//        });
//
//
//        $scope.$watch('formOpposingTeam.$invalid', function(invalid) {
//
//            tabs.instructions.disabled = invalid;
//        });
//
//
//        $scope.$watch('tabs["opposing-team"].disabled', function(disabled) {
//
//            tabs.instructions.disabled = disabled;
//        });
//
//        $scope.save = function() {
//            $scope.data.opposingTeam.players = players.getPositionsFromDowndown($scope.data.opposingTeam.players, $scope.opposingTeamRosterId, $scope.positions);
//            players.save($scope.game.rosters[$scope.game.opposingTeamId].id, $scope.data.opposingTeam.players);
//            tabs.activateTab('instructions');
//        };

    }
]);

