/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/player-dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayerDropdown
 * @module PlayerDropdown
 */
var PlayerDropdown = angular.module('Item.PlayerDropdown', []);

/* Cache the template file */
PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('item/player-dropdown-input.html', require('./player-dropdown-input.html'));
    }
]);

/**
 * PlayerDropdown directive.
 * @module PlayerDropdown
 * @name PlayerDropdown
 * @type {Directive}
 */
PlayerDropdown.directive('krossoverItemPlayerDropdown', [
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory', '$timeout',
    function directive(ROLES, session, tagsets, teams, players, $timeout) {

        var PlayerDropdown = {

            restrict: TO += ELEMENTS,
            controller: 'PlayerDropdownController',
            controllerAs: 'playerDropdownController',
            templateUrl: templateUrl
        };

        return PlayerDropdown;
    }
]);

PlayerDropdown.controller('PlayerDropdownController', [
    '$scope',
    'ROLES',
    'SessionService',
    'TeamsFactory',
    'PlayersFactory',
    '$timeout',
    function PlayerDropdownController($scope, ROLES, session, teams, players, $timeout) {
        //TODO get rid a ton of these un-needed variables
        var team = ($scope.game && $scope.game.teamId) ? teams.get($scope.game.teamId) : {};
        var opposingTeam = ($scope.game && $scope.game.opposingTeamId) ? teams.get($scope.game.opposingTeamId) : {};

        // Don't need to populate these if the drop-down isn't editable
        var teamPlayers;
        var opposingTeamPlayers;
        if ($scope.isEditable) {
            teamPlayers = $scope.game.getTeamPlayers();
            opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
        }

        $scope.event.variableValues[$scope.item.id].type = 'Player';
        $scope.teamRoster = $scope.game.getRoster(team.id);
        $scope.opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);

        $scope.onBlur = function() {
            // TODO: THIS IS A BAD HACK. THERE ARE MORE COMPLEX, BUT BETTER WAYS TO DO THIS.
            // THIS TIMEOUT IS SET TO 200 SO THAT THE CODE INSIDE DOES NOT RESET THE VALUE
            // BEFORE THE selectPlayer FUNCTION CAN BE EXECUTED WHEN A USER CLICKS ON THE
            // DROP DOWN RESULTS AND BLUR EVENT FIRES.
            // THIS IS ONLY BEING DONE SINCE THE BUG THAT IT FIXES IS CUSTOMER FACING
            $timeout(function() {
                $scope.isReset = false;
                if (!$scope.event.variableValues[$scope.item.id].value) {
                    if ($scope.item.isRequired) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = null;
                    }
                }
            }, 200);
        };

        if (teamPlayers) {
            teamPlayers.forEach(function(player) {

                if (player.isUnknown) {

                    player.jerseyNumber = 'UN';
                    player.primaryJerseyColor = $scope.game.primaryJerseyColor;
                }

                else {

                    player.jerseyNumber = parseInt($scope.teamRoster.playerInfo[player.id].jerseyNumber, 10);
                    player.primaryJerseyColor = $scope.game.primaryJerseyColor;
                }
            });
        }

        if (opposingTeamPlayers) {
            opposingTeamPlayers.forEach(function(player) {

                if (player.isUnknown) {

                    player.jerseyNumber = 'UN';
                    player.primaryJerseyColor = $scope.game.opposingPrimaryJerseyColor;
                }

                else {

                    player.jerseyNumber = parseInt($scope.opposingTeamRoster.playerInfo[player.id].jerseyNumber, 10);
                    player.primaryJerseyColor = $scope.game.opposingPrimaryJerseyColor;
                }
            });
        }

        $scope.players = players.getCollection();
        $scope.playersList = (opposingTeamPlayers && teamPlayers) ? teamPlayers.concat(opposingTeamPlayers) : [];

        var addPoints = function(playerId, points) {

            if (!playerId) return;

            /* If the tag has points to assign. */
            if ($scope.tag.pointsAssigned) {

                /* If this team is the team. */
                if ($scope.game.isPlayerOnTeam(playerId)) {

                    /* If the points should be assigned to the variable team. */
                    if ($scope.tag.assignThisTeam) {

                        /* Assign the points to this team. */
                        $scope.play.teamPointsAssigned += points;
                    }

                    /* If the points should be assigned to the other team. */
                    else {

                        /* Assign the points to the other team. */
                        $scope.play.opposingPointsAssigned += points;
                    }
                }

                /* If this team is the opposing team.*/
                else if ($scope.game.isPlayerOnOpposingTeam(playerId)) {

                    /* If the points should be assigned to the variable team. */
                    if ($scope.tag.assignThisTeam) {

                        /* Assign the points to this team. */
                        $scope.play.opposingPointsAssigned += points;
                    }

                    /* If the points should be assigned to the other team. */
                    else {

                        /* Assign the points to the other team. */
                        $scope.play.teamPointsAssigned += points;
                    }
                }
            }
        };

        var assignPoints = function(playerId) {

            addPoints(playerId, $scope.tag.pointsAssigned);
        };

        var unassignPoints = function(playerId) {

            addPoints(playerId, -$scope.tag.pointsAssigned);
        };

        if ($scope.item.index === 1 && !$scope.autoAdvance) {

            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                /* Set the team in possession on the play if not already set. */
                if (variableValue && !$scope.play.possessionTeamId) $scope.play.possessionTeamId = $scope.game.isPlayerOnTeam(variableValue) ? $scope.game.teamId : $scope.game.opposingTeamId;

                /* If the values have changed. */
                if (variableValue !== previousVariableValue) {

                    unassignPoints(previousVariableValue);
                }

                assignPoints(variableValue);
            });

            $scope.$on('$destroy', function() {

                unassignPoints($scope.event.variableValues[$scope.item.id].value);
            });
        }

        $scope.selectPlayer = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
        };
    }
]);

