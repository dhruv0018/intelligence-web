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
    function directive() {

        var TeamDropdown = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                data: '=',
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
            if (!$scope.data.game) throw new Error('No game in data');
            if (!$scope.data.teams) throw new Error('No teams in data');
        }

        function post($scope, element, attributes) {

            $scope.event.variableValues[$scope.item.index].type = 'Team';

            $scope.team = $scope.data.teams.get($scope.data.game.teamId);
            $scope.opposingTeam = $scope.data.teams.get($scope.data.game.opposingTeamId);
        }

        return TeamDropdown;
    }
]);

