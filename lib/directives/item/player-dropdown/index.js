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
        $scope.players = players.getCollection();
        $scope.playersList = playerlist.get();

        $scope.selectPlayer = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
        };
    }
]);
