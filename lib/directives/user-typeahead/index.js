/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * UserTypeahead
 * @module UserTypeahead
 */
var UserTypeahead = angular.module('user-typeahead', ['ui.bootstrap']);

/* Cache the template file */
UserTypeahead.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('user-typeahead.html', require('./template.html'));
        $templateCache.put('user-typeahead-dropdown.html', require('./user-typeahead-dropdown.html'));
    }
]);

/**
 * UserTypeahead directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
UserTypeahead.directive('userTypeahead', [
    '$filter', '$state', 'UsersFactory', 'LeaguesFactory', 'SportsFactory',
    function directive($filter, $state, users, leagues, sports) {

        var userTypeahead = {

            restrict: TO += ELEMENTS,
            templateUrl: 'user-typeahead.html',
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
                        scope.usersLoading = false;
                        return $filter('orderBy')(users, 'firstName');
                    });
                };
            }
        };

        return userTypeahead;
    }
]);
