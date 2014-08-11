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
                autoAdvance: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var tagId = $scope.event.tagId;
            var tagsetId = $scope.league.tagSetId;
            var tagset = tagsets.get(tagsetId);
            var tags = tagset.getIndexedTags();
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
            };

            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                if ($scope.autoAdvance) return;

                /* Set the team in possession on the play if not already set. */
                if (!$scope.play.possessionTeamId) $scope.play.possessionTeamId = variableValue;

                /* If the tag is to assign points to this team. */
                if (tag.pointsAssigned && tag.assignThisTeam) {

                    /* If the values have changed. */
                    if (variableValue !== previousVariableValue) {

                        /* If this team was the team. */
                        if ($scope.team.id == previousVariableValue) {

                            /* Unassign the points to the team. */
                            $scope.play.teamPointsAssigned -= tag.pointsAssigned;
                        }

                        /* If this team was the opposing team. */
                        else if ($scope.opposingTeam.id == previousVariableValue) {

                            /* Unassign the points to the opposing team. */
                            $scope.play.opposingPointsAssigned -= tag.pointsAssigned;
                        }
                    }

                    /* If this team is the team.*/
                    if ($scope.team.id == variableValue) {

                        /* Assign the points to the team. */
                        $scope.play.teamPointsAssigned += tag.pointsAssigned;
                    }

                    /* If this team is the opposing team.*/
                    else if ($scope.opposingTeam.id == variableValue) {

                        /* Assign the points to the opposing team. */
                        $scope.play.opposingPointsAssigned += tag.pointsAssigned;
                    }
                }
            });

            element.on('$destroy', function() {

                if ($scope.autoAdvance) return;

                if (!$scope.event.variableValues[$scope.item.id].value) return;

                /* If the tag is to assign points to this team. */
                if (tag.pointsAssigned && tag.assignThisTeam) {

                    /* If this team was the team. */
                    if ($scope.team.id == $scope.event.variableValues[$scope.item.id].value) {

                        /* Unassign the points to the team. */
                        $scope.play.teamPointsAssigned -= tag.pointsAssigned;
                    }

                    /* If this team was the opposing team. */
                    else if ($scope.opposingTeam.id == $scope.event.variableValues[$scope.item.id].value) {

                        /* Unassign the points to the opposing team. */
                        $scope.play.opposingPointsAssigned -= tag.pointsAssigned;
                    }
                }
            });
        }

        return TeamDropdown;
    }
]);

