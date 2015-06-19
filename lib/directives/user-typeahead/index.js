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
    '$filter', '$state', 'UsersFactory',
    function directive($filter, $state, users) {

        var userTypeahead = {

            restrict: TO += ELEMENTS,
            templateUrl: 'user-typeahead.html',
            scope: {
                user: '=ngModel',
                role: '=?',
                filter: '=?',
                id: '@?'
            },
            link: function($scope, element, attributes) {
                $scope.filter = $scope.filter || {};

                if ($scope.role) {
                    $scope.filter.role = $scope.role.type.id;
                }

                $scope.searchUsers = function() {
                    return users.query($scope.filter).then(orderUsers);

                    function orderUsers(users) {
                        return $filter('orderBy')(users, 'firstName');
                    }
                };

                $scope.selectUser = function(user) {
                    $scope.user = user;
                };
            }
        };

        return userTypeahead;
    }
]);
