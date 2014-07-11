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
                role: '='
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

                $scope.displayTeamsLoading = false;
                $scope.displayTeams = true;
                $scope.displayTeamsEmpty = false;

                $scope.$watch('sportId', function() {

                    if ($scope.sportId) {

                        $scope.displayTeamsLoading = true;
                        $scope.displayTeams = false;
                        $scope.displayTeamsEmpty = false;

                        var filter = {

                            noRoleType: $scope.role.type.id,
                            sport: $scope.sportId
                        };

                        teams.query(filter, function(list) {

                            $scope.teams = list.filter(function(team) {

                                if ($scope.user.roles.every(function(role) {

                                    return team.id !== role.teamId;

                                })) {

                                    return team;
                                }
                            });

                            $scope.displayTeamsLoading = false;
                            $scope.displayTeams = true;
                            $scope.displayTeamsEmpty = false;
                        });
                    }
                });

                $scope.$watch('teams', function() {

                    if ($scope.teams) {

                        if ($scope.teams.length === 0) {

                            $scope.displayTeamsLoading = false;
                            $scope.displayTeams = false;
                            $scope.displayTeamsEmpty = true;
                        }
                    }
                });

                $scope.addRole = function(newRole) {

                    /* Remove role from the newRoles array. */
                    $scope.user.newRoles.splice($scope.user.newRoles.indexOf(newRole), 1);

                    /* Add role to the user roles array. */
                    $scope.user.roles.unshift(angular.copy(newRole));

                    element.remove();
                };
            }
        };

        return role;
    }
]);

