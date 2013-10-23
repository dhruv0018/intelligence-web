/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('users', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Users.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('user.html', require('./user.html'));
        $templateCache.put('users.html', require('./users.html'));
    }
]);

/**
 * Users page state router.
 * @module Users
 * @type {UI-Router}
 */
Users.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('users', {
                url: '/users',
                views: {
                    'header': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    },
                    'main': {
                        templateUrl: 'users.html',
                        controller: 'UsersController'
                    }
                }
            })

            .state('user', {
                url: '/users',
                views: {
                    'header': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    },
                    'main': {
                        templateUrl: 'user.html',
                        controller: 'UserController'
                    }
                }
            });
    }
]);

/**
 * User value. Holds data for the current user.
 * @module Users
 * @name User
 * @type {Value}
 */
Users.value('User', {

    data: null,

    set: function(user) {
        this.data = user;
    }
});

/**
 * User controller. Controls the view for adding and editing a single user.
 * @module User
 * @name UserController
 * @type {Controller}
 */
Users.controller('UserController', [
    '$rootScope', '$scope', '$state', 'User', 'Users',
    function controller($rootScope, $scope, $state, user, users) {

        $scope.user = user.data;

        $scope.save = function(user) {

            if (!user) return;

            /* User ID's are assigned server side, if it is present that means
             * the user is present on the server, so update them (PUT).
             * If not present then this a new user so create them (POST). */
            if (user.id) users.update(user);
            else users.save(user);

            $state.go('users');
        };

        $scope.cancel = function() {

            $state.go('users');
        };

        $scope.addRole = function(newRole) {

            $scope.user = $scope.user || {};
            $scope.user.roles = $scope.user.roles || [];

            $scope.user.roles.push(angular.copy(newRole));
        };

        $scope.removeRole = function(role) {

            $scope.user.roles.splice($scope.user.roles.indexOf(role), 1);
        };
    }
]);

/**
 * Users controller. Controls the view for displaying multiple users.
 * @module Users
 * @name UsersController
 * @type {Controller}
 */
Users.controller('UsersController', [
    '$rootScope', '$scope', '$state', 'User', 'Users',
    function controller($rootScope, $scope, $state, user, users) {

        $scope.users = users.query();

        $scope.add = function() {

            user.set(null);
            $state.go('user');
        };

        $scope.edit = function(data) {

            user.set(data);
            $state.go('user');
        };
    }
]);

