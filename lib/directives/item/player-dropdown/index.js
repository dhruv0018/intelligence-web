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
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory',
    function directive(ROLES, session, tagsets, teams, players) {

        var PlayerDropdown = {

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

            controller: 'PlayerDropdown.controller',

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

            $scope.event.variableValues[$scope.item.id].type = 'Player';

            $scope.teamRoster = teamRoster;
            $scope.opposingTeamRoster = opposingTeamRoster;

            var currentUser = session.currentUser;

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.reset = function() {

                $scope.event.activeEventVariableIndex = $scope.item.index;
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
                $scope.isReset = true;
            };

            $scope.indexedTeamPlayers = {};
            $scope.teamPlayers.forEach(function(player, index) {
                $scope.indexedTeamPlayers[player.id] = player;

                // TODO: should we remove them from being indexed if isActive is false?
                if (!$scope.teamRoster.playerInfo[player.id].isActive) {
                    this.splice(index, 1);
                    return;
                }

                if (player.isUnknown) {

                    player.lastName = 'Player';
                    player.jerseyNumber = 'UN';
                }

                else {
                    player.jerseyNumber = $scope.teamRoster.playerInfo[player.id].jerseyNumber;
                }

                player.jerseyColor = $scope.game.primaryJerseyColor;
            }, $scope.teamPlayers);
            $scope.indexedOpposingTeamPlayers = {};
            $scope.opposingTeamPlayers.forEach(function(player, index) {

                $scope.indexedOpposingTeamPlayers[player.id] = player;

                // TODO: should we remove them from being indexed if isActive is false?
                if (!$scope.opposingTeamRoster.playerInfo[player.id].isActive) {
                    this.splice(index, 1);
                    return;
                }

                if (player.isUnknown) {

                    player.lastName = 'Player';
                    player.jerseyNumber = 'UN';
                }

                else {

                    player.jerseyNumber = $scope.opposingTeamRoster.playerInfo[player.id].jerseyNumber;
                }

                player.jerseyColor = $scope.game.opposingPrimaryJerseyColor;
            }, $scope.opposingTeamPlayers);

            $scope.players = players.getCollection();
            $scope.playersList = $scope.teamPlayers.concat($scope.opposingTeamPlayers);

            var isPlayerOnTeam = function(playerId) {

                /* Get the player. */
                var player = players.get(playerId);

                /* Get the team ID. */
                var teamId = $scope.game.teamId;

                /* Get the team roster ID. */
                var teamRoster = $scope.game.getRoster(teamId);

                /* Check if the player is on the team roster. */
                // TODO: Use isActive attribute on playerInfo as well?
                return angular.isDefined(teamRoster.playerInfo[player.id]);
            };

            var addPoints = function(playerId, points) {

                if (!playerId) return;

                /* If the tag has points to assign. */
                if (tag.pointsAssigned) {

                    /* If this team is the team. */
                    if (isPlayerOnTeam(playerId)) {

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

            var assignPoints = function(playerId) {

                addPoints(playerId, tag.pointsAssigned);
            };

            var unassignPoints = function(playerId) {

                addPoints(playerId, -tag.pointsAssigned);
            };

            if ($scope.item.index === 1 && !$scope.autoAdvance) {

                $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                    /* Set the team in possession on the play if not already set. */
                    if (variableValue && !$scope.play.possessionTeamId) $scope.play.possessionTeamId = isPlayerOnTeam(variableValue) ? $scope.game.teamId : $scope.game.opposingTeamId;

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

        return PlayerDropdown;
    }
]);

/**
 * PlayerDropdown controller.
 * @module PlayerDropdown
 * @name PlayerDropdown.controller
 * @type {controller}
 */
PlayerDropdown.controller('PlayerDropdown.controller', [
    '$scope',
    function controller($scope) {

        $scope.selectPlayer = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
        };
    }
]);

