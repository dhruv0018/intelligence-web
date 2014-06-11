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
                },
                resolve: {
                    'Admin.Users.Data': [
                        '$q', 'Admin.Users.Data',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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
                },
                onEnter: [
                    'AlertsService', 'Users.User.Service',
                    function(alerts, user) {

                        if (user.isLocked) {

                            alerts.add({

                                type: 'danger',
                                message: 'This user is locked'
                            });
                        }
                    }
                ],
                onExit: [
                    'AlertsService',
                    function(alerts) {

                        alerts.clear();
                    }
                ]
            })

            .state('user-info', {
                url: '',
                parent: 'user',
                views: {
                    'info@user': {
                        templateUrl: 'users/user-info.html',
                        controller: 'Users.User.Info.Controller'
                    }
                }
            })

            .state('user-roles', {
                url: '',
                parent: 'user',
                views: {
                    'roles@user': {
                        templateUrl: 'users/user-roles.html',
                        controller: 'Users.User.Roles.Controller'
                    }
                }
            });
    }
]);

