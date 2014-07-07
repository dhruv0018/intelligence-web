/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * User controller. Controls the view for adding and editing a single user.
 * @module Users
 * @name User.New.Controller
 * @type {Controller}
 */
Users.controller('Users.User.New.Controller', [
    '$scope', '$state', '$modalInstance', 'UsersFactory',
    function controller($scope, $state, $modalInstance, users) {

        $scope.user = {};

        $scope.close = function() {

            users.save($scope.user);

            $state.go('user-info', { id: $scope.user.id });

            $modalInstance.close();
        };
    }
]);

