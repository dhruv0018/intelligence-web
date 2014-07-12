/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * New role directive.
 * @module Users
 * @name NewRole
 * @type {Directive}
 */
Users.directive('krossoverNewRole', [
    'ROLES', 'ROLE_TYPE', 'UsersFactory', 'TeamsFactory', 'SportsFactory', 'INDEXER_GROUPS_ID',
    function directive(ROLES, ROLE_TYPE, users, teams, sports, INDEXER_GROUPS_ID) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {

                user: '=',
                role: '=',
                newRoles: '='
            },

            templateUrl: 'users/newrole.html',

            link: function($scope, element, attributes) {

                $scope.INDEXER = ROLES.INDEXER;
                $scope.HEAD_COACH = ROLES.HEAD_COACH;
                $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
                $scope.ATHLETE = ROLES.ATHLETE;
                $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;

                $scope.user.roles = $scope.user.roles || [];

                $scope.users = users;
                $scope.sportsList = sports.getList();
                $scope.teamsList = teams.getList();

                $scope.$watch('role', function(role) {

                    $scope.teamsList = $scope.teamsList.filter(function(team) {

                        /* If there are no roles on the team. */
                        if (!team.roles || !team.roles.length) return true;

                        /* If the role is a head coach and the team already has one. */
                        if (users.is(role, ROLES.HEAD_COACH)) {

                            return !!team.getHeadCoachRole();

                        }

                        return true;
                    });
                });

                $scope.$watchCollection('user.roles', function(roles) {

                    $scope.teamsList = $scope.teamsList.filter(function(team) {

                        /* If the user is already assigned a role on the team. */
                        return roles.every(function(role) {

                            return team.id !== role.teamId;
                        });
                    });
                });

                $scope.addRole = function(newRole) {

                    /* Remove role from the newRoles array. */
                    $scope.newRoles.splice($scope.newRoles.indexOf(newRole), 1);

                    /* Add role to the user roles array. */
                    users.addRole($scope.user, newRole);

                    element.remove();
                };
            }
        };

        return role;
    }
]);

