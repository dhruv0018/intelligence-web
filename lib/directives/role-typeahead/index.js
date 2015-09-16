/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RoleTypeahead
 * @module RoleTypeahead
 */
var RoleTypeahead = angular.module('role-typeahead', ['ui.bootstrap']);

/* Cache the template file */
RoleTypeahead.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('role-typeahead.html', require('./template.html'));
        $templateCache.put('role-typeahead-dropdown.html', require('./role-typeahead-dropdown.html'));
    }
]);

/**
 * RoleTypeahead directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
RoleTypeahead.directive('roleTypeahead', [
    '$filter', '$state', 'UsersFactory', 'LeaguesFactory', 'SportsFactory',
    function directive($filter, $state, users, leagues, sports) {

        var roleTypeahead = {

            restrict: TO += ELEMENTS,
            templateUrl: 'role-typeahead.html',
            scope: {
                user: '=ngModel',
                role: '=?',
                filter: '=?'
            },
            link: function($scope, element, attributes) {
                $scope.filter = $scope.filter || {};

                if ($scope.role) {
                    $scope.filter.role = $scope.role.type.id;
                }

                $scope.searchUsers = function() {
                    return users.typeahead($scope.filter)
                    .then(addRoles)
                    .then(addSportNameToUsers)
                    .then(orderUsers);

                    //TODO: let server send the role object, that will eleminate the duplication and will be more accurate
                    function addRoles(users) {
                        let usersWithRole = [];
                        users.forEach(user => {
                            let roles = user.getRolesByTeamId(user.team.id);
                            roles.forEach(role => {
                                let userWithRole = angular.copy(user);
                                userWithRole.role = role;
                                usersWithRole.push(userWithRole);
                            });
                        });
                        return usersWithRole;
                    }

                    function addSportNameToUsers(users) {
                        return users.map(setUserSportName);
                    }

                    function setUserSportName(user) {
                        var userLeague = leagues.get(user.team.leagueId);
                        var userSport = sports.get(userLeague.sportId);
                        user.sportName = userSport.name;
                        return user;
                    }

                    function orderUsers(users) {
                        return $filter('orderBy')(users, 'firstName');
                    }
                };

                $scope.selectUser = function(user) {
                    $scope.user = user;
                };
            }
        };

        return roleTypeahead;
    }
]);
