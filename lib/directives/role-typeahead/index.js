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
                user: '=',
                role: '=?',
                filter: '=?'
            },
            replace: true,
            link: function(scope, element, attrs) {
                var sportsMap = sports.getMap();
                var leaguesMap = leagues.getMap();
                scope.filter = scope.filter || {};
                scope.usersLoading = false;

                scope.$watch('user', function() {
                    scope.filter.fullName = scope.user;

                    if (typeof scope.role !== 'undefined') {
                        scope.filter.role = scope.role.type.id;
                    }
                });

                scope.findUsers = function() {
                    scope.usersLoading = true;
                    return users.typeahead(scope.filter).then(function(users) {
                        users.forEach(function(user) {
                            user.sportName = sportsMap[leaguesMap[user.leagueId].sportId].name;
                        });
                        return $filter('orderBy')(users, 'firstName');
                    }).finally(function() {
                        scope.usersLoading = false;
                    });
                };
            }
        };

        return roleTypeahead;
    }
]);
