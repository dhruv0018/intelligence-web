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
                    'Admin.Users.Data.Dependencies': [
                        '$q', 'Admin.Users.Data.Dependencies',
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
                    'Admin.Users.Data.Dependencies': [
                        '$q', 'Admin.Users.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                },
                onEnter: [
                    '$stateParams', 'AlertsService', 'Admin.Users.Data.Dependencies',
                    function($stateParams, alerts, data) {

                        var user = data.users.get($stateParams.id);

                        if (user && user.isLocked) {

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

