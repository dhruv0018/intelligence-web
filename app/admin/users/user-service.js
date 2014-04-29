/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * User service.
 * @module Users
 * @name Users.User.Service
 * @type {Controller}
 */
Users.service('Users.User.Service', [
    'UsersFactory',
    function service(users) {

        var UserService = {

            init: function(userId) {

                /* Get the user by ID from the server. */
                return users.get(userId).$promise;
            }
        };

        return UserService;
    }
]);

