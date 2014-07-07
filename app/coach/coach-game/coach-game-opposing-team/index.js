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
                game: '=?',
                data: '='
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
        $scope.tabs = tabs;
        $scope.config = config;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Positions
        $scope.positions = $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions;

        $scope.$watch('data.game', function(game) {
            if (game.id) {
                $scope.data.game.opposingTeamRosterId = game.rosters[game.opposingTeamId].id;
                angular.forEach($scope.data.gamePlayerLists[game.opposingTeamId], function(player) {
                    player = players.constructPositionDropdown(player, game.rosters[game.opposingTeamId].id, $scope.positions);
                });
            }
        });

        $scope.$watch('validation.opposingTeam', function(valid) {
            if (valid) {
                tabs.instructions.disabled = false;
            } else {
                tabs.instructions.disabled = true;
            }
        });

        $scope.$watch('tabs["opposing-team"].disabled', function(disabled) {
            if (disabled) {
                tabs.instructions.disabled = disabled;
            }
        });

        $scope.save = function() {

            angular.forEach($scope.data.gamePlayerLists[$scope.data.game.opposingTeamId], function(player) {
                player = players.getPositionsFromDowndown(player, $scope.data.game.opposingTeamRosterId, $scope.positions);
            });

            players.save($scope.data.game.rosters[$scope.data.game.opposingTeamId].id, $scope.data.gamePlayerLists[$scope.data.game.opposingTeamId]).then(function(roster) {
                $scope.data.gamePlayerLists[$scope.data.game.opposingTeamId] = roster;

                angular.forEach($scope.data.gamePlayerLists[$scope.data.game.opposingTeamId], function(player) {
                    player = players.constructPositionDropdown(player, $scope.data.game.opposingTeamRosterId, $scope.positions);
                });
            });

            tabs.activateTab('instructions');
        };

    }
]);

