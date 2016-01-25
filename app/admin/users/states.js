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
                        '$q', 'Admin.Users.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                }
            })

            .state('user', {
                url: '/user?id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'users/user.html',
                        controller: 'Users.User.Controller'
                    }
                },
                resolve: {
                    'Admin.Users.Data': [
                        '$q', '$stateParams', 'TeamsFactory', 'UsersFactory', 'SchoolsFactory', 'Admin.Users.Data.Dependencies',
                        function($q, $stateParams, teams, users, schools, data) {

                            var user;
                            var userId = Number($stateParams.id);

                            if (userId) {

                                try {

                                    user = users.get(userId);
                                }

                                catch (error) {

                                    user = users.load(userId);
                                }
                            }

                            let relatedteams = teams.load({relatedUserId: userId});

                            let relatedSchools = schools.load({relatedUserId: userId});

                            return $q.all([user, relatedteams, relatedSchools, data]);
                        }
                    ]
                },
                onEnter: [
                    '$q', '$stateParams', 'AlertsService', 'UsersFactory', 'Admin.Users.Data',
                    function($q, $stateParams, alerts, users, data) {

                        var userId = Number($stateParams.id);

                        if (userId) {

                            var user = users.get(userId);

                            if (user && user.isLocked) {

                                alerts.add({

                                    type: 'danger',
                                    message: 'This user is locked'
                                });
                            }
                        }
                    }
                ]
            })
            .state('user-roles', {
                url: '/roles',
                parent: 'user',
                views: {
                    'roles@user': {
                        templateUrl: 'users/user-roles.html',
                        controller: 'Users.User.Roles.Controller'
                    }
                }
            })
            .state('user-info', {
                url: '/info',
                parent: 'user',
                views: {
                    'info@user': {
                        templateUrl: 'users/user-info.html',
                        controller: 'Users.User.Info.Controller'
                    }
                }
            });
    }
]);
