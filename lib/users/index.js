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
        $templateCache.put('adduser.html', require('./adduser.html'));
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
Users.value('UserValue', {

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
    '$rootScope', '$scope', '$state', 'UserValue', 'UsersFactory',
    function controller($rootScope, $scope, $state, user, users) {

        $scope.user = user.data;

        $scope.save = function(user) {

            if (!user) return;

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
    '$rootScope', '$scope', '$state', '$modal', 'UserValue', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, user, users) {

        $scope.users = users.getAll();

        $scope.add = function() {

            user.set(null);

            $modal.open({

                templateUrl: 'adduser.html'

            }).result.then($scope.edit);
        };

        $scope.edit = function(data) {

            user.set(data);
            $state.go('user');
        };
    }
]);

