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
    function directive() {

        var PlayerDropdown = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                data: '=',
                game: '=',
                item: '=',
                event: '=',
                autoAdvance: '='
            },

            link: {
                pre: pre,
                post: post
            },

            templateUrl: templateUrl
        };

        function pre($scope, element, attributes) {

            if (!$scope.data) throw new Error('No data provided');
            if (!$scope.data.teams) throw new Error('No teams in data');
            if (!$scope.data.players) throw new Error('No players in data');
            if (!$scope.data.teamPlayers) throw new Error('No team players in data');
            if (!$scope.data.opposingTeamPlayers) throw new Error('No opposing team players in data');
        }

        function post($scope, element, attributes) {

            $scope.event.variableValues[$scope.item.id].type = 'Player';

            $scope.players = $scope.data.players.getCollection();

            var team = teams.get($scope.game.teamId);
            var opposingTeam = teams.get($scope.game.opposingTeamId);

            var teamRoster = $scope.game.getRoster(team.id);
            var opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);

            $scope.data.teamPlayers.forEach(function(player, index) {

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
            }, $scope.data.teamPlayers);

            $scope.data.opposingTeamPlayers.forEach(function(player, index) {

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
            }, $scope.data.opposingTeamPlayers);

            $scope.playersList = $scope.data.teamPlayers.concat($scope.data.opposingTeamPlayers);

            $scope.selectPlayer = function($item) {

                $scope.event.variableValues[$scope.item.id].value = $item.id;
            };
        }

        return PlayerDropdown;
    }
]);

