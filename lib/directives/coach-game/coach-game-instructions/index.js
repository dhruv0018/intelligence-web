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
                game: '=',
                positionset: '=',
                remainingBreakdowns: '='
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
    '$scope', '$state', 'GAME_STATUSES', 'PositionsetsFactory', 'GamesFactory', 'TeamsFactory', 'SessionService', 'AlertsService',
    function controller($scope, $state, GAME_STATUSES, positionsets, games, teams, session, alerts) {
        $scope.positionset = $scope.positionset;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.isBreakdownChoiceMade = false;
        $scope.isNonRegularGame = $scope.game.isNonRegular();

        $scope.returnToGameAlert = function() {
            alerts.add({
                type: 'super-danger',
                message: 'Once you upload your roster, click here to return to your uploaded game and submit for breakdown.'
            });
        };

        var teamIdForThisGame = session.currentUser.currentRole.teamId;
        if ($scope.game.uploaderTeamId) {
            teamIdForThisGame = $scope.game.uploaderTeamId;
        }

        $scope.activePlan = teams.get(teamIdForThisGame).getActivePlan() || {};
        $scope.activePackage = teams.get(teamIdForThisGame).getActivePackage() || {};
        $scope.remainingBreakdowns = session.currentUser.remainingBreakdowns;

        $scope.$watchCollection('game', function(game) {
            if (game.id) {
                if (game.status) {
                    $scope.statusBuffer = game.status;
                    $scope.isBreakdownChoiceMade = true;
                } else {
                    $scope.statusBuffer = 0;
                }

                if (game.isRegular()) {
                    //Make sure team has roster
                    //Note, this is not a team roster per se, rather, it is the roster from the game keyed by your team id
                    var teamRoster = (game.teamId && game.rosters && game.rosters[game.teamId]) ? game.getRoster(game.teamId) : null;
                    //greater than 1 because game rosters always have an unknown player
                    //so an empty check is to see if there are more than one player besides the unknown player
                    $scope.hasRoster = (teamRoster && teamRoster.playerInfo && Object.keys(teamRoster.playerInfo).length > 1) ? true : false;
                }
            }
        });

        $scope.switchChoice = function() {
            $scope.statusBuffer = ($scope.game.status === $scope.GAME_STATUSES.NOT_INDEXED.id) ? $scope.GAME_STATUSES.SUBMITTED_FOR_INDEXING.id : $scope.GAME_STATUSES.NOT_INDEXED.id;
            $scope.isBreakdownChoiceMade = false;
        };

        $scope.save = function() {
            $scope.game.status = $scope.statusBuffer;

            if ($scope.game.status === GAME_STATUSES.SUBMITTED_FOR_INDEXING.id) {
                $scope.game.submittedAt = new Date().toISOString();
            } else {
                $scope.game.submittedAt = null;
            }

            $scope.savingBreakdown = true;
            $scope.game.save().then(function(game) {
                games.fetch($scope.game.id).then(function(responseGame) {
                    angular.extend($scope.game, responseGame);
                    $scope.savingBreakdown = false;
                    $scope.isBreakdownChoiceMade = true;
                    teams.getRemainingBreakdowns(session.currentUser.currentRole.teamId).then(function(breakdownData) {
                        session.currentUser.remainingBreakdowns = breakdownData;
                        $scope.remainingBreakdowns = session.currentUser.remainingBreakdowns;
                    });
                });
            });
        };
    }
]);
