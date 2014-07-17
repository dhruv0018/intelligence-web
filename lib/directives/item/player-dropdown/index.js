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

            $scope.selectPlayer = function($item) {

                $scope.event.variableValues[$scope.item.id].value = $item.id;
            };
        }

        return PlayerDropdown;
    }
]);

