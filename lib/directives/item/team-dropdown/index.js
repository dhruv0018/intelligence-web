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
            controller: 'TeamDropdownController',
            templateUrl: templateUrl
        };

        return TeamDropdown;
    }
]);

TeamDropdown.controller('TeamDropdownController',[
        '$scope', 'SessionService', 'TeamsFactory', 'ROLES',
        function TeamDropdownController($scope, session, teams, ROLES) {
            $scope.event.variableValues[$scope.item.id].type = 'Team';
            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
        }
]);
