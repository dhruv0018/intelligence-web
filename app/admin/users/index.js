const angular = window.angular;

/* File dependencies */
import UserController from './user-controller';
import UserInfoController from './user-info-controller';
import UserRolesController from './user-roles-controller';
import UsersController from './users-controller';
import NewRoleDirective from './new-role/directive';

/**
 * Users page module.
 * @module Users
 */
const Users = angular.module('Users', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide',
    'ngMaterial'
]);

Users.directive('newRole', NewRoleDirective);

Users.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('users', {
                url: '/users',
                parent: 'base',
                views: {
                    'main@root': {
                        templateUrl: 'app/admin/users/users.html',
                        controller: UsersController
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
                        templateUrl: 'app/admin/users/user.html',
                        controller: UserController
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
                        templateUrl: 'app/admin/users/user-roles.html',
                        controller: UserRolesController
                    }
                }
            })
            .state('user-info', {
                url: '/info',
                parent: 'user',
                views: {
                    'info@user': {
                        templateUrl: 'app/admin/users/user-info.html',
                        controller: UserInfoController
                    }
                }
            });
    }
]);

/**
 * Admin Users Data service.
 * @module Users
 * @type {service}
 */
Users.service('Admin.Users.Data.Dependencies', [
    'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function(sports, leagues, teams, users) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load()
        };

        return Data;
    }
]);

Users.filter('EditableRolesByRole', [
    'ROLES', 'UsersFactory',
    function(ROLES, users) {

        return function(roles, role) {

            var filtered = [];

            if (!roles || !role) return filtered;

            angular.forEach(roles, function(filterRole) {

                /* Don't display group roles. */
                if (!Array.isArray(filterRole.type.id)) {

                    /* Add the role to the filtered list if the user has access. */
                    if (users.hasAccess(role, filterRole)) {

                        /* FIXME: Temporarily removing "Parent" role. */
                        if (!users.is(filterRole, ROLES.ANONYMOUS) && !users.is(filterRole, ROLES.PARENT)) {

                            filtered.push(filterRole);
                        }
                    }
                }
            });

            return filtered;
        };
    }
]);

Users.filter('role', [
    'ROLES', 'ROLE_ID',
    function(ROLES, ROLE_ID) {

        return function(users, role) {

            var filtered = [];

            if (!role) return filtered;

            angular.forEach(users, function(user) {

                if (user.has(ROLES[ROLE_ID[role]])) {

                    filtered.push(user);
                }
            });

            return filtered;
        };
    }
]);

Users.filter('rolesFilter', [
    'ROLE_ID', 'ROLE_TYPE', 'ROLES',
    function(ROLE_ID, ROLE_TYPE, ROLES) {
        return function(users, filter) {
            if (filter && !filter.role) {
                return users;
            }

            var role = ROLES[ROLE_ID[filter.role]];

            return users.filter(function(user) {
                return user.isActive(role);
            });

        };
    }
]);

export default Users;
