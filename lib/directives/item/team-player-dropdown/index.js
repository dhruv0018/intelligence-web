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
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory', '$timeout', 'PlayerlistManager',
    function directive(ROLES, session, tagsets, teams, players, $timeout, playerlist) {


        var TeamPlayerDropdown = {

            restrict: TO += ELEMENTS,
            controller: 'TeamPlayerDropdownController',
            controllerAs: 'teamPlayerDropdown',
            templateUrl: templateUrl
        };

        return TeamPlayerDropdown;
    }
]);

TeamPlayerDropdown.controller('TeamPlayerDropdownController', [
    '$scope', 'TeamsFactory', 'SessionService', 'ROLES', 'PlayersFactory', 'PlayerlistManager',
    function teamPlayerDropdownController($scope, teams, session, ROLES, players, playerlist) {
        var team = teams.get($scope.game.teamId);
        var opposingTeam = teams.get($scope.game.opposingTeamId);

        $scope.teamRoster = $scope.game.getRoster(team.id);
        $scope.opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);
        $scope.players = players.getCollection();

        team.type = 'Team';
        opposingTeam.type = 'Team';
        $scope.teams = {};
        $scope.teams[team.id] = team;
        $scope.teams[opposingTeam.id] = opposingTeam;

        $scope.teamPlayerOptions = playerlist.get();
        $scope.teamPlayerOptions.push(team);
        $scope.teamPlayerOptions.push(opposingTeam);
    }
]);
