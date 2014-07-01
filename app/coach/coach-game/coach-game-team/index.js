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
                data: '=',
                validation: '=?'
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
    'config', '$rootScope', '$scope', '$state', '$localStorage', 'GamesFactory', 'PlayersFactory', 'Coach.Game.Tabs',
    function controller(config, $rootScope, $scope, $state, $localStorage, games, players, tabs) {
        $scope.tabs = tabs;
        $scope.data = {};
        $scope.config = config;

        //Positions
        $scope.positions = $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions;

        $scope.$watch('data.game', function(game) {
            if ($scope.data.gamePlayerLists) {
                angular.forEach($scope.data.gamePlayerLists[game.teamId], function(player) {
                    player = players.constructPositionDropdown(player, game.rosters[game.teamId].id, $scope.positions);
                });
            }

        });

        $scope.$watch('validation.scoutingTeam', function(valid) {
            if (valid) {
                tabs['opposing-team'].disabled = false;
            } else {
                tabs['opposing-team'].disabled = true;
            }

        });

        $scope.$watch('tabs["scouting-team"].disabled', function(disabled) {
            if (disabled) {
                tabs['opposing-team'].disabled = disabled;
            }
        });

        $scope.save = function() {

            angular.forEach($scope.data.gamePlayerLists[$scope.data.game.teamId], function(player) {
                player = players.getPositionsFromDowndown(player, $scope.data.game.teamId, $scope.positions);
            });

            players.save($scope.data.game.rosters[$scope.data.game.teamId].id, $scope.data.gamePlayerLists[$scope.data.game.teamId]).then(function(roster) {
                $scope.data.gamePlayerLists[$scope.data.game.teamId] = roster;

                angular.forEach($scope.data.gamePlayerLists[$scope.data.game.opposingTeamId], function(player) {
                    player = players.constructPositionDropdown(player, $scope.data.game.teamId, $scope.positions);
                });
            });

            tabs.activateTab('instructions');
        };
//
//        $scope.save = function() {
//            angular.forEach($scope.data.team.players, function(player) {
//                player = players.getPositionsFromDowndown(player, $scope.scoutingTeamId, $scope.positions);
//            });
//
//            players.save($scope.game.rosters[$scope.game.teamId].id, $scope.data.team.players).then(function(roster) {
//                $scope.data.team.players = roster;
//                angular.forEach($scope.data.team.players, function(player) {
//                    player = players.constructPositionDropdown(player, $scope.scoutingTeamId, $scope.positions);
//                });
//            });
//            tabs.activateTab('opposing-team');
//        };

    }
]);

