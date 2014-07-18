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
    'TeamsFactory', 'PlayersFactory',
    function directive(teams, players) {

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
                autoAdvance: '='
            },

            link: link,

            controller: 'PlayerDropdown.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.event.variableValues[$scope.item.id].type = 'Player';

            $scope.players = players.getCollection();

            var team = teams.get($scope.game.teamId);
            var opposingTeam = teams.get($scope.game.opposingTeamId);

            var teamRoster = $scope.game.getRoster(team.id);
            var opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);

            $scope.teamPlayers.forEach(function(player, index) {

                if (!player.rosterStatuses[teamRoster.id]) {
                    this.splice(index, 1);
                    return;
                }

                if (player.isUnknown) {

                    player.lastName = 'Player';
                    player.jerseyNumber = 'U';
                }

                else {

                    player.jerseyNumber = player.jerseyNumbers[teamRoster.id];
                }

                player.jerseyColor = $scope.game.primaryJerseyColor;
            }, $scope.teamPlayers);

            $scope.opposingTeamPlayers.forEach(function(player, index) {

                if (!player.rosterStatuses[opposingTeamRoster.id]) {
                    this.splice(index, 1);
                    return;
                }

                if (player.isUnknown) {

                    player.lastName = 'Player';
                    player.jerseyNumber = 'U';
                }

                else {

                    player.jerseyNumber = player.jerseyNumbers[opposingTeamRoster.id];
                }

                player.jerseyColor = $scope.game.opposingPrimaryJerseyColor;
            }, $scope.opposingTeamPlayers);

            $scope.playersList = $scope.teamPlayers.concat($scope.opposingTeamPlayers);
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
    '$scope', 'PlayersFactory', 'TagsetsFactory',
    function controller($scope, players, tagsets) {

        var tagId = $scope.event.tagId;
        var tagsetId = $scope.league.tagSetId;
        var tagset = tagsets.get(tagsetId);
        var tags = tagset.getIndexedTags();
        var tag = tags[tagId];

        $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

            if ($scope.autoAdvance) return;

            var isPlayerOnTeam = function(playerId) {

                /* Get the player. */
                var player = players.get(playerId);

                /* Get the team ID. */
                var teamId = $scope.game.teamId;

                /* Get the team roster ID. */
                var teamRosterId = $scope.game.rosters[teamId].id;

                /* Check if the player is on the team roster. */
                var isPlayerOnTeam = !!~player.rosterIds.indexOf(teamRosterId);

                return isPlayeronTeam;
            };

            /* Set the team in possession on the play if not already set. */
            if (!$scope.play.possessionTeamId) $scope.play.possessionTeamId = isPlayerOnTeam(variableValue) ? $scope.game.teamId : $scope.game.opposingTeamId;

            /* If the tag is to assign points to this players team. */
            if (tag.pointsAssigned && tag.assignThisTeam) {

                /* If the values have changed. */
                if (variableValue !== previousVariableValue) {

                    /* If this player was on the team. */
                    if (isPlayeronTeam(previousVariableValue)) {

                        /* Unassign the points to the team. */
                        $scope.play.teamPointsAssigned -= tag.pointsAssigned;
                    }

                    /* If this player was on the opposing team. */
                    else {

                        /* Unassign the points to the opposing team. */
                        $scope.play.opposingPointsAssigned -= tag.pointsAssigned;
                    }
                }

                /* If this player is on the team.*/
                if (isPlayeronTeam(variableValue)) {

                    /* Assign the points to the team. */
                    $scope.play.teamPointsAssigned += tag.pointsAssigned;
                }

                /* If this player is on the opposing team.*/
                else {

                    /* Assign the points to the opposing team. */
                    $scope.play.opposingPointsAssigned += tag.pointsAssigned;
                }
            }
        }, true);

        $scope.selectPlayer = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
        };
    }
]);

