/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/instructions.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module Instructions
 */
var Instructions = angular.module('Coach.Game.Instructions', []);

/* Cache the template file */
Instructions.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Instructions directive.
 * @module Instructions
 * @name Instructions
 * @type {directive}
 */
Instructions.directive('krossoverCoachGameInstructions', [
    function directive() {

        var krossoverCoachGameInstructions = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Instructions.controller',

            scope: {
                data: '='
            }
        };

        return krossoverCoachGameInstructions;
    }
]);
/**
 * Instructions controller.
 * @module Instructions
 * @name Instructions
 * @type {controller}
 */
Instructions.controller('Coach.Game.Instructions.controller', [
    '$scope', '$state', 'GAME_STATUSES', 'GamesFactory', 'TeamsFactory', 'SessionService', 'AlertsService',
    function controller($scope, $state, GAME_STATUSES, games, teams, session, alerts) {

        $scope.keys = window.Object.keys;
        $scope.positions = ($scope.data.league.positionSetId) ? $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions : {};

        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.isBreakdownChoiceMade = false;

        //Make sure team has roster
        $scope.hasRoster = false;

        $scope.$watch('data.gamePlayerLists[data.game.teamId]', function(x) {
            if ($scope.data.gamePlayerLists && $scope.data.gamePlayerLists[$scope.data.game.teamId] && !$scope.data.gamePlayerLists[$scope.data.game.teamId].every(function(player) { return player.isUnknown; })) {

                $scope.hasRoster = true;
            }
        });

        $scope.returnToGameAlert = function() {
            alerts.add({
                type: 'super-danger',
                message: 'Once you upload your roster, click here to return to your uploaded game and submit for breakdown.'
            });
        };

        var teamIdForThisGame = session.currentUser.currentRole.teamId;
        if ($scope.data.game.uploaderTeamId) {
            teamIdForThisGame = $scope.data.game.uploaderTeamId;
        }

        $scope.activePlan = teams.get(teamIdForThisGame).getActivePlan() || {};
        $scope.activePackage = teams.get(teamIdForThisGame).getActivePackage() || {};
        $scope.remainingBreakdowns = $scope.data.remainingBreakdowns;

        $scope.$watch('data.game', function(game) {
            if (typeof game !== 'undefined' && typeof game.status !== 'undefined' && game.status !== null) {
                $scope.statusBuffer = game.status;
                $scope.isBreakdownChoiceMade = true;
            } else {
                $scope.statusBuffer = 0;
            }

        });

        $scope.switchChoice = function() {
            $scope.statusBuffer = ($scope.data.game.status === $scope.GAME_STATUSES.NOT_INDEXED.id) ? $scope.GAME_STATUSES.READY_FOR_INDEXING.id : $scope.GAME_STATUSES.NOT_INDEXED.id;
            $scope.isBreakdownChoiceMade = false;
        };

        $scope.save = function() {
            $scope.data.game.status = $scope.statusBuffer;

            if ($scope.data.game.status === GAME_STATUSES.READY_FOR_INDEXING.id) {
                $scope.data.game.submittedAt = new Date().toISOString();
            } else {
                $scope.data.game.submittedAt = null;
            }

            $scope.savingBreakdown = true;
            $scope.data.game.save().then(function(game) {
                $scope.savingBreakdown = false;
                $scope.isBreakdownChoiceMade = true;
            });
        };
    }
]);

