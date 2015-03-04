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
            controller: teamDropdownController,
            templateUrl: templateUrl
        };

        function teamDropdownController($scope) {
            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

            //TODO remove this later
            var tag = $scope.tag;
            $scope.event.variableValues[$scope.item.id].type = 'Team';

            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
            var currentUser = session.currentUser;

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);
            $scope.isReset = false;

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.onChange = function() {
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                }
            };

            $scope.onBlur = function() {
                $scope.isReset = false;
                if (!$scope.event.variableValues[$scope.item.id].value) {
                    if ($scope.item.isRequired) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = null;
                    }
                }
            };

            $scope.shouldFocus = function() {
                if ($scope.autoAdvance === true) {
                    return $scope.event.activeEventVariableIndex == $scope.item.index;
                } else {
                    return $scope.isReset;
                }
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

            var addPoints = function(teamId, points) {

                /* If the tag has points to assign. */
                if (tag.pointsAssigned) {

                    /* If this team is the team. */
                    if ($scope.team.id == teamId) {

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
                    else if ($scope.opposingTeam.id == teamId) {

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

            var assignPoints = function(teamId) {

                addPoints(teamId, tag.pointsAssigned);
            };

            var unassignPoints = function(teamId) {

                addPoints(teamId, -tag.pointsAssigned);
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

        return TeamDropdown;
    }
]);

