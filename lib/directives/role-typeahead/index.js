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
                    return users.roleTypeahead($scope.filter)
                    .then(addSportNameAndRoleTypeToUsers)
                    .then(orderUsers);

                    function addSportNameAndRoleTypeToUsers(users) {
                        return users.map(user => {
                            const userLeague = leagues.get(user.team.leagueId);
                            const userSport = sports.get(userLeague.sportId);
                            user.sportName = userSport.name;
                            user.role.type = {
                                    id: user.role.type,
                                    name: user.getRoleNameByRoleType(user.role.type)
                            };
                            return user;
                        });
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
