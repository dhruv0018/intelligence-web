/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/team-dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamDropdown
 * @module TeamDropdown
 */
var TeamDropdown = angular.module('Item.TeamDropdown', []);

/* Cache the template file */
TeamDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * TeamDropdown directive.
 * @module TeamDropdown
 * @name TeamDropdown
 * @type {Directive}
 */
TeamDropdown.directive('krossoverItemTeamDropdown', [
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory',
    function directive(ROLES, session, tagsets, teams) {

        var TeamDropdown = {
            restrict: TO += ELEMENTS,
            controllerAs: 'teamDropdown',
            controller: 'TeamDropdownController',
            templateUrl: templateUrl
        };

        return TeamDropdown;
    }
]);

TeamDropdown.controller('TeamDropdownController',[
        '$scope', 'SessionService', 'TeamsFactory', 'ROLES',
        function TeamDropdownController($scope, session, teams, ROLES) {
            $scope.event.variableValues[$scope.item.id].type = 'Team';
            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);


            var addPoints = function(teamId, points) {

                /* If the $scope.tag has points to assign. */
                if ($scope.tag.pointsAssigned) {

                    /* If this team is the team. */
                    if ($scope.team.id == teamId) {

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
                    else if ($scope.opposingTeam.id == teamId) {

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

            var assignPoints = function(teamId) {

                addPoints(teamId, $scope.tag.pointsAssigned);
            };

            var unassignPoints = function(teamId) {

                addPoints(teamId, -$scope.tag.pointsAssigned);
            };

            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                if (variableValue) {

                    $scope.event.variableValues[$scope.item.id].value = Number(variableValue);
                }

                if ($scope.item.index === 1 && !$scope.autoAdvance) {

                    /* Set the team in possession on the play if not already set. */
                    if (!$scope.play.possessionTeamId) $scope.play.possessionTeamId = variableValue;

                    /* If the values have changed. */
                    if (variableValue !== previousVariableValue) {

                        unassignPoints(previousVariableValue);
                    }

                    assignPoints(variableValue);
                }
            });

            if ($scope.item.index === 1 && !$scope.autoAdvance) {

                $scope.$on('$destroy', function() {

                    unassignPoints($scope.event.variableValues[$scope.item.id].value);
                });
            }
        }
]);
