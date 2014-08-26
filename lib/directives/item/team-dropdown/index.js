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
    'TagsetsFactory', 'TeamsFactory',
    function directive(tagsets, teams) {

        var TeamDropdown = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                game: '=',
                item: '=',
                play: '=',
                plays: '=',
                event: '=',
                league: '=',
                autoAdvance: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var tagId = $scope.event.tagId;
            var tagsetId = $scope.league.tagSetId;
            var tagset = tagsets.get(tagsetId);
            var tags = tagset.tags;
            var tag = tags[tagId];

            $scope.event.variableValues[$scope.item.id].type = 'Team';

            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.reset = function() {

                $scope.event.activeEventVariableIndex = $scope.item.index;
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

                element.on('$destroy', function() {

                    unassignPoints($scope.event.variableValues[$scope.item.id].value);
                });
            }
        }

        return TeamDropdown;
    }
]);

