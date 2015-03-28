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
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory', '$timeout', 'PlayerlistManager',
    function directive(ROLES, session, tagsets, teams, players, $timeout, playerlist) {

        var PlayerDropdown = {

            restrict: TO += ELEMENTS,
            controller: 'PlayerDropdownController',
            controllerAs: 'playerDropdownController',
            templateUrl: templateUrl
        };

        return PlayerDropdown;
    }
]);

PlayerDropdown.controller('PlayerDropdownController', [
    '$scope',
    'ROLES',
    'SessionService',
    'TeamsFactory',
    'PlayersFactory',
    'PlayerlistManager',
    function PlayerDropdownController($scope, ROLES, session, teams, players, playerlist) {
        //TODO get rid a ton of these un-needed variables
        var team = ($scope.game && $scope.game.teamId) ? teams.get($scope.game.teamId) : {};
        var opposingTeam = ($scope.game && $scope.game.opposingTeamId) ? teams.get($scope.game.opposingTeamId) : {};

        // Don't need to populate these if the drop-down isn't editable
        var teamPlayers;
        var opposingTeamPlayers;
        if ($scope.isEditable) {
            teamPlayers = $scope.game.getTeamPlayers();
            opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
        }

        $scope.event.variableValues[$scope.item.id].type = 'Player';
        $scope.teamRoster = $scope.game.getRoster(team.id);
        $scope.opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);
        $scope.players = players.getCollection();
        $scope.playersList = playerlist.get();

        if ($scope.item.index === 1 && !$scope.autoAdvance) {

            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {
                // TODO: recalculate
            });

            $scope.$on('$destroy', function() {
                    // TODO: recalculate
            });
        }

        $scope.selectPlayer = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
        };
    }
]);
