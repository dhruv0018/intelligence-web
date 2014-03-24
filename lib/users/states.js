/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

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
                parent: 'base',
                views: {
                    'main@root': {
                        templateUrl: 'users.html',
                        controller: 'UsersController'
                    }
                }
            })

            .state('user', {
                url: '/user/:id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'user.html',
                        controller: 'UserController'
                    }
                }
            })

            .state('user-info', {
                url: '',
                parent: 'user',
                views: {
                    'content@user': {
                        templateUrl: 'user-info.html',
                        controller: 'UserController'
                    }
                }
            })

            .state('user-roles', {
                url: '',
                parent: 'user',
                views: {
                    'content@user': {
                        templateUrl: 'user-roles.html',
                        controller: 'UserController'
                    }
                }
            });
    }
]);

