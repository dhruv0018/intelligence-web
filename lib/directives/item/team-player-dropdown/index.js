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
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory',
    function directive(ROLES, session, tagsets, teams, players) {

        var TeamPlayerDropdown = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                game: '=',
                item: '=',
                play: '=',
                plays: '=',
                event: '=',
                league: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                autoAdvance: '=?'
            },

            link: link,

            controller: 'TeamPlayerDropdown.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var tagId = $scope.event.tagId;
            var tagsetId = $scope.league.tagSetId;
            var tagset = tagsets.get(tagsetId);
            var tags = tagset.tags;
            var tag = tags[tagId];

            var team = teams.get($scope.game.teamId);
            var opposingTeam = teams.get($scope.game.opposingTeamId);
            var teamRoster = $scope.game.getRoster(team.id);
            var opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);

            $scope.teamRoster = teamRoster;
            $scope.opposingTeamRoster = opposingTeamRoster;

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

            $scope.indexedTeamPlayers = {};
            $scope.teamPlayers.forEach(function(player, index) {

                $scope.indexedTeamPlayers[player.id] = player;

                if (!$scope.teamRoster.playerInfo[player.id].isActive) {
                    this.splice(index, 1);
                    return;
                }

                if (player.isUnknown) {

                    player.lastName = 'Player';
                    player.jerseyNumber = 'UN';
                }

                else {

                    player.jerseyNumber = parseInt($scope.teamRoster.playerInfo[player.id].jerseyNumber, 10);
                }
                player.type = 'Player';
                player.jerseyColor = $scope.game.primaryJerseyColor;
            }, $scope.teamPlayers);

            $scope.indexedOpposingTeamPlayers = {};
            $scope.opposingTeamPlayers.forEach(function(player, index) {

                $scope.indexedOpposingTeamPlayers[player.id] = player;

                if (!$scope.opposingTeamRoster.playerInfo[player.id].isActive) {
                    this.splice(index, 1);
                    return;
                }

                if (player.isUnknown) {

                    player.lastName = 'Player';
                    player.jerseyNumber = 'UN';
                }

                else {
                    player.jerseyNumber = parseInt($scope.opposingTeamRoster.playerInfo[player.id].jerseyNumber, 10);
                }
                player.type = 'Player';
                player.jerseyColor = $scope.game.opposingPrimaryJerseyColor;
            }, $scope.opposingTeamPlayers);

            $scope.players = players.getCollection();

            team.type = 'Team';
            opposingTeam.type = 'Team';
            $scope.teams = {};
            $scope.teams[team.id] = team;
            $scope.teams[opposingTeam.id] = opposingTeam;

            $scope.teamPlayerOptions = [];
            $scope.teamPlayerOptions.push(team);
            $scope.teamPlayerOptions.push(opposingTeam);
            $scope.teamPlayerOptions = $scope.teamPlayerOptions.concat($scope.teamPlayers);
            $scope.teamPlayerOptions = $scope.teamPlayerOptions.concat($scope.opposingTeamPlayers);

            // Add points functions are a blend from the player-dropdown and team-dropdown item directives
            // TODO: Clean up these functions and/or move them elsewhere.
            var isPlayerOnTeam = function(playerId) {

                /* Get the player. */
                var player = players.get(playerId);

                /* Get the team ID. */
                var teamId = $scope.game.teamId;

                /* Get the team roster */
                var teamRoster = $scope.game.getRoster(teamId);

                /* Check if the player is on the team roster. */
                return angular.isDefined(teamRoster.playerInfo[player.id]);
            };

            var addPoints = function(playerOrTeamId, points) {

                if (!playerOrTeamId) return;

                /* If the tag has points to assign. */
                if (tag.pointsAssigned) {

                    var type = $scope.event.variableValues[$scope.item.id].type;

                    /* If this team is the team. */
                    if ((type === 'Player' && isPlayerOnTeam(playerOrTeamId)) || (type === 'Team' && $scope.team.id == playerOrTeamId)) {

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
                            $scope.play.possessionTeamId = isPlayerOnTeam(variableValue) ? $scope.game.teamId : $scope.game.opposingTeamId;
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

                element.on('$destroy', function() {

                    unassignPoints($scope.event.variableValues[$scope.item.id].value);
                });
            }
        }

        return TeamPlayerDropdown;
    }
]);

/**
 * TeamPlayerDropdown controller.
 * @module TeamPlayerDropdown
 * @name TeamPlayerDropdown.controller
 * @type {controller}
 */
TeamPlayerDropdown.controller('TeamPlayerDropdown.controller', [
    '$scope',
    function controller($scope) {

        $scope.selectItem = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
            $scope.event.variableValues[$scope.item.id].type = $item.type;
        };
    }
]);

