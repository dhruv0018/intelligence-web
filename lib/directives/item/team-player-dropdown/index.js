/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/team-player-dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamPlayerDropdown
 * @module TeamPlayerDropdown
 */
var TeamPlayerDropdown = angular.module('Item.TeamPlayerDropdown', []);

/* Cache the template file */
TeamPlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('item/team-player-dropdown-input.html', require('./team-player-dropdown-input.html'));
    }
]);

/**
 * TeamPlayerDropdown directive.
 * @module TeamPlayerDropdown
 * @name TeamPlayerDropdown
 * @type {Directive}
 */
TeamPlayerDropdown.directive('krossoverItemTeamPlayerDropdown', [
    '$injector', 'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory', '$timeout',
    function directive($injector, ROLES, session, tagsets, teams, players, $timeout) {

        var TeamPlayerDropdown = {

            restrict: TO += ELEMENTS,
            controller: 'TeamPlayerDropdownController',
            controllerAs: 'teamPlayerDropdown',
            templateUrl: templateUrl
        };

        return TeamPlayerDropdown;
    }
]);

TeamPlayerDropdown.controller('TeamPlayerDropdownController', [
    '$scope', 'TeamsFactory', 'SessionService', 'ROLES', 'PlayersFactory',
    function teamPlayerDropdownController($scope, teams, session, ROLES, players) {
        var tag = $scope.tag;
        var team = teams.get($scope.game.teamId);
        var opposingTeam = teams.get($scope.game.opposingTeamId);
        // Don't need to populate these if the drop-down isn't editable
        var teamPlayers;
        var opposingTeamPlayers;
        if ($scope.isEditable) {
            teamPlayers = $scope.game.getTeamPlayers();
            opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
        }

        $scope.isReset = false;
        $scope.teamRoster = $scope.game.getRoster(team.id);
        $scope.opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);



        $scope.onChange = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index + 1;
            }
        };

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

        $scope.reset = function() {
            if ($scope.autoAdvance === true) {
                $scope.event.activeEventVariableIndex = $scope.item.index;
            } else {
                $scope.event.activeEventVariableIndex = 0;
            }
            $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
            $scope.event.variableValues[$scope.item.id].value = undefined;
            $scope.isReset = true;
        };

        if (teamPlayers) {
            teamPlayers.forEach(function(player) {

                player.type = 'Player';

                if (player.isUnknown) {

                    player.jerseyNumber = 'UN';
                    player.primaryJerseyColor = $scope.game.primaryJerseyColor;
                }

                else {

                    player.jerseyNumber = $scope.teamRoster.playerInfo[player.id].jerseyNumber;
                    player.primaryJerseyColor = $scope.game.primaryJerseyColor;
                }
            });
        }

        if (opposingTeamPlayers) {
            opposingTeamPlayers.forEach(function(player) {

                player.type = 'Player';

                if (player.isUnknown) {

                    player.jerseyNumber = 'UN';
                    player.primaryJerseyColor = $scope.game.opposingPrimaryJerseyColor;
                }

                else {

                    player.jerseyNumber = $scope.opposingTeamRoster.playerInfo[player.id].jerseyNumber;
                    player.primaryJerseyColor = $scope.game.opposingPrimaryJerseyColor;
                }
            });
        }

        $scope.players = players.getCollection();

        team.type = 'Team';
        opposingTeam.type = 'Team';
        $scope.teams = {};
        $scope.teams[team.id] = team;
        $scope.teams[opposingTeam.id] = opposingTeam;

        $scope.teamPlayerOptions = [];
        $scope.teamPlayerOptions.push(team);
        $scope.teamPlayerOptions.push(opposingTeam);

        $scope.teamPlayerOptions = teamPlayers ? $scope.teamPlayerOptions.concat(teamPlayers) : $scope.teamPlayerOptions;
        $scope.teamPlayerOptions = opposingTeamPlayers ? $scope.teamPlayerOptions.concat(opposingTeamPlayers) : $scope.teamPlayerOptions;

        // Add points functions are a blend from the player-dropdown and team-dropdown item directives
        // TODO: Clean up these functions and/or move them elsewhere.

        var addPoints = function(playerOrTeamId, points) {

            if (!playerOrTeamId) return;

            /* If the tag has points to assign. */
            if (tag.pointsAssigned) {

                var type = $scope.event.variableValues[$scope.item.id].type;

                /* If this team is the team. */
                if ((type === 'Player' && $scope.game.isPlayerOnTeam(playerOrTeamId)) || (type === 'Team' && $scope.team.id == playerOrTeamId)) {

                    /* If the points should be assigned to the variable team. */
                    if (tag.assignThisTeam) {

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
                else {

                    /* If the points should be assigned to the variable team. */
                    if (tag.assignThisTeam) {

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

        var assignPoints = function(playerOrTeamId) {

            addPoints(playerOrTeamId, tag.pointsAssigned);
        };

        var unassignPoints = function(playerOrTeamId) {

            addPoints(playerOrTeamId, -tag.pointsAssigned);
        };

        if ($scope.item.index === 1 && !$scope.autoAdvance) {

            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                if ($scope.event.variableValues[$scope.item.id].type === 'Player') {

                    /* Set the team in possession on the play if not already set. */
                    if (variableValue && !$scope.play.possessionTeamId) {
                        $scope.play.possessionTeamId = $scope.game.isPlayerOnTeam(variableValue) ? $scope.game.teamId : $scope.game.opposingTeamId;
                    }

                } else if ($scope.event.variableValues[$scope.item.id].type === 'Team') {

                    if (variableValue) {
                        $scope.event.variableValues[$scope.item.id].value = Number(variableValue);
                    }

                    /* Set the team in possession on the play if not already set. */
                    if (variableValue && !$scope.play.possessionTeamId) $scope.play.possessionTeamId = variableValue;

                }

                /* If the values have changed. */
                if (variableValue !== previousVariableValue) {
                    unassignPoints(previousVariableValue);
                }

                assignPoints(variableValue);
            });

            $scope.$on('$destroy', function() {

                unassignPoints($scope.event.variableValues[$scope.item.id].value);
            });

            $scope.selectItem = function($item) {

                $scope.event.variableValues[$scope.item.id].value = $item.id;
                $scope.event.variableValues[$scope.item.id].type = $item.type;
            };
        }
    }
]);
