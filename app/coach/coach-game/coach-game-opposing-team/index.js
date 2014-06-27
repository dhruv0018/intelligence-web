/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/opposing-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Opposing Team page module.
 * @module OpposingTeam
 */
var OpposingTeam = angular.module('Coach.Game.OpposingTeam', []);

/* Cache the template file */
OpposingTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * OpposingTeam directive.
 * @module OpposingTeam
 * @name OpposingTeam
 * @type {directive}
 */
OpposingTeam.directive('krossoverCoachGameOpposingTeam', [
    function directive() {

        var krossoverCoachGameOpposingTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.OpposingTeam.controller',

            scope: {
                opposingTeamRoster: '=?',
                game: '=?'
            }
        };

        return krossoverCoachGameOpposingTeam;
    }
]);

/**
 * OpposingTeam controller.
 * @module OpposingTeam
 * @name OpposingTeam
 * @type {controller}
 */
OpposingTeam.controller('Coach.Game.OpposingTeam.controller', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'Coach.Game.Tabs',  'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, tabs, games, players) {

//        $scope.tabs = tabs;
//        $scope.data = {};
//        $scope.config = config;
//
//        data.then(function(coachData) {
//            $scope.data = coachData;
//            $scope.positions = coachData.positionSet.indexedPositions;
//
//            if (coachData.opposingTeamGameRoster) {
//                $scope.data.opposingTeam = {
//                    players: coachData.opposingTeamGameRoster.players || []
//                };
//                angular.forEach($scope.data.opposingTeam.players, function(player) {
//                    player = players.constructPositionDropdown(player, coachData.game.rosters[coachData.game.opposingTeamId].id, $scope.positions);
//                });
//
//            }
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
//                    $scope.validation.opposingTeam = false;
//                }
//            } else {
//                $scope.data.opposingTeam = {
//                    players: []
//                };
//            }
//        });
//
//        $scope.$watch('validation.opposingTeam', function(valid) {
//            if (valid) {
//                tabs.instructions.disabled = false;
//            } else {
//                tabs.instructions.disabled = true;
//            }
//        });
//
//        $scope.$watch('tabs["opposing-team"].disabled', function(disabled) {
//            if (disabled) {
//                tabs.instructions.disabled = disabled;
//            }
//        });
//
//        $scope.save = function() {
//
//            angular.forEach($scope.data.opposingTeam.players, function(player) {
//                player = players.getPositionsFromDowndown(player, $scope.opposingTeamRosterId, $scope.positions);
//            });
//
//            players.save($scope.game.rosters[$scope.game.opposingTeamId].id, $scope.data.opposingTeam.players).then(function(roster) {
//                $scope.data.opposingTeam.players = roster;
//
//                angular.forEach($scope.data.opposingTeam.players, function(player) {
//                    player = players.constructPositionDropdown(player, $scope.opposingTeamRosterId, $scope.positions);
//                });
//            });
//
//            tabs.activateTab('instructions');
//        };

    }
]);

