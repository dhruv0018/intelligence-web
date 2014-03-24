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
                        templateUrl: 'users/users.html',
                        controller: 'Users.Users.Controller'
                    }
                }
            })

            .state('user', {
                url: '/user/:id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'users/user.html',
                        controller: 'Users.User.Controller'
                    }
                },
                resolve: {
                    'Users.User.Service': [
                        '$stateParams', 'Users.User.Service',
                        function($stateParams, user) {

                            var userId = $stateParams.id;

                            if (!userId) return user;
                            else return user.init(userId);
                        }
                    ]
                }
            })

            .state('user-info', {
                url: '',
                parent: 'user',
                views: {
                    'content@user': {
                        templateUrl: 'users/user-info.html',
                        controller: 'Users.User.Controller'
                    }
                }
            })

            .state('user-roles', {
                url: '',
                parent: 'user',
                views: {
                    'content@user': {
                        templateUrl: 'users/user-roles.html',
                        controller: 'Users.User.Controller'
                    }
                }
            });
    }
]);

