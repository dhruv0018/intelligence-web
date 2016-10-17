/*globals require*/
/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * UserTypeahead
 * @module UserTypeahead
 */
const UserTypeahead = angular.module('user-typeahead', ['ui.bootstrap']);

/**
 * UserTypeahead directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
UserTypeahead.directive('userTypeahead', [
    '$filter', '$state', 'UsersFactory',
    function directive($filter, $state, users) {

        const userTypeahead = {

            restrict: TO += ELEMENTS,
            templateUrl: 'lib/directives/user-typeahead/template.html',
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

export default UserTypeahead;
