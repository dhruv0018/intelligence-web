/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Role
 * @module Role
 */
var Role = angular.module('role', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Role.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('role.html', template);
    }
]);

/**
 * Role directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Role.directive('krossoverRole', [
    'ROLES', 'UsersFactory', 'TeamsFactory',
    function directive(ROLES, users, teams) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {

                user: '=',
                role: '='
            },

            templateUrl: 'role.html',

            link: function($scope, element, attributes) {

                $scope.COACH = ROLES.COACH;

                $scope.users = users;

                if (!$scope.role) {

                    $scope.role = {};
                    $scope.role.type = {};
                    $scope.role.type.name = 'New User';
                }

                if ($scope.role.teamId) {

                    $scope.team = teams.get($scope.role.teamId);
                }
            }
        };

        return role;
    }
]);

