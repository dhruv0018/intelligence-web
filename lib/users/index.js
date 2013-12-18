/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('users', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
Users.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('user.html', require('./user.html'));
        $templateCache.put('adduser.html', require('./adduser.html'));
        $templateCache.put('newrole.html', require('./newrole.html'));
        $templateCache.put('users.html', require('./users.html'));
        $templateCache.put('user-info.html', require('./user-info.html'));
        $templateCache.put('user-roles.html', require('./user-roles.html'));
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
                },
                onEnter: [
                    '$rootScope', '$stateParams', 'AlertsService', 'UserValue', 'UsersFactory',
                    function($rootScope, $stateParams, alerts, user, users) {

                    if ($stateParams.id) {

                        users.get($stateParams.id, function(user) {

                            if (!user.isActive) {

                                alerts.clear();

                                $rootScope.$broadcast('alert', {

                                    type: 'danger',
                                    message: 'This user is locked'
                                });
                            }
                        });

                    } else {

                        if (!user.isActive) {

                            alerts.clear();

                            $rootScope.$broadcast('alert', {

                                type: 'danger',
                                message: 'This user is locked'
                            });
                        }
                    }
                }],

                onExit: [ 'AlertsService', function(alerts) {

                    alerts.remove(0);
                }]
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

Users.filter('EditableRolesByRole', [
    'UsersFactory',
    function (users) {

        return function(roles, role) {

            var filtered = [];

            if (!roles || !role) return filtered;

            angular.forEach(roles, function(filterRole) {

                /* Don't display group roles. */
                if (!Array.isArray(filterRole.type.id)) {

                    /* Add the role to the filtered list if the user has access. */
                    if (users.hasAccess(role, filterRole)) {

                        filtered.push(filterRole);
                    }
                }
            });

            return filtered;
        };
    }
]);

/**
 * New role directive.
 * @module Users
 * @name NewRole
 * @type {Directive}
 */
Users.directive('krossoverNewRole', [
    'ROLES', 'ROLE_TYPE', 'UsersFactory', 'TeamsFactory', 'SportsResource',
    function directive(ROLES, ROLE_TYPE, users, teams, sports) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {

                user: '=',
                role: '='
            },

            templateUrl: 'newrole.html',

            link: function($scope, element, attributes) {

                $scope.INDEXER = ROLES.INDEXER;
                $scope.HEAD_COACH = ROLES.HEAD_COACH;
                $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
                $scope.ATHLETE = ROLES.ATHLETE;

                $scope.users = users;
                $scope.sports = sports.query();

                $scope.displayTeamsLoading = false;
                $scope.displayTeams = true;
                $scope.displayTeamsEmpty = false;

                $scope.$watch('sportId', function() {

                    if ($scope.sportId) {

                        $scope.displayTeamsLoading = true;
                        $scope.displayTeams = false;
                        $scope.displayTeamsEmpty = false;

                        var filter = {

                            noRoleType: $scope.role.type.id,
                            sport: $scope.sportId
                        };

                        teams.filter(filter, function(list) {

                            $scope.teams = list.filter(function(team) {

                                if ($scope.user.roles.every(function(role) {

                                    return team.id !== role.teamId;

                                })) {

                                    return team;
                                }
                            });

                            $scope.displayTeamsLoading = false;
                            $scope.displayTeams = true;
                            $scope.displayTeamsEmpty = false;
                        });
                    }
                });

                $scope.$watch('teams', function() {

                    if ($scope.teams) {

                        if ($scope.teams.length === 0) {

                            $scope.displayTeamsLoading = false;
                            $scope.displayTeams = false;
                            $scope.displayTeamsEmpty = true;
                        }
                    }
                });

                $scope.addRole = function(newRole) {

                    /* Remove role from the newRoles array. */
                    $scope.user.newRoles.splice($scope.user.newRoles.indexOf(newRole), 1);

                    /* Add role to the user roles array. */
                    $scope.user.roles.unshift(angular.copy(newRole));

                    element.remove();
                };
            }
        };

        return role;
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
    '$rootScope', '$scope', '$state', '$stateParams', 'SessionService', 'AuthenticationService', 'ROLES', 'UsersFactory', 'UserValue',
    function controller($rootScope, $scope, $state, $stateParams, session, auth, ROLES, users, userValue) {

        /* Setup $scope. */

        $scope.ROLES = ROLES;
        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.users = users;

        $scope.currentUser = session.currentUser;

        $scope.auth = auth;

        var setScopeUser = function(user) {

            $scope.user = user || {};
            $scope.user.newRoles = [];

            /* If the user has roles, they already exist, so use a known role. */
            if ($scope.user.roles) {

                /* Set the role to the users default role, or
                 * their first role if no default is set. */
                $scope.role = $scope.user.getDefaultRole() || $scope.user.roles[0];
            }
        };

        if ($stateParams.id) {

            users.get($stateParams.id, function(user) {

                setScopeUser(user);
            });

        } else {

            setScopeUser(userValue.data);
        }


        /* Setup watches. */


        $scope.$watch('user.roles', function(roles) {

            $scope.disableSave = !roles || roles.length < 1;

        }, true);


        $scope.save = function(user) {

            users.save(user);

            /* Check if the modified user is the currently logged in user. */
            if (session.currentUser.id === user.id) {

                /* If so, update the current user. */
                session.storeCurrentUser(user);
            }

            $state.go('users');
        };

        $scope.addNewRole = function(newRole) {

            if (!newRole) return;

            $scope.user.roles = $scope.user.roles || [];

            /* In the case of an Admin role, there is no information to fill in,
             * so add the role directly. */
            if (users.is(newRole, ROLES.ADMIN)) {

                $scope.user.roles.unshift(angular.copy(newRole));

            /* For other roles; fill in information before adding. */
            } else {

                $scope.user.newRoles.unshift(angular.copy(newRole));
            }
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
    '$rootScope', '$scope', '$state', '$modal', '$stateParams', 'SessionService', 'ROLES', 'UsersFactory', 'UserValue',
    function controller($rootScope, $scope, $state, $modal, $stateParams, session, ROLES, users, userValue) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.currentUser = session.currentUser;
        $scope.statuses = [{value: 1, label: 'Active'}, {value: 0, label: 'Not Active'}];

        $scope.users = users.getList();

        $scope.add = function() {

            $modal.open({

                templateUrl: 'adduser.html'

            }).result.then($scope.edit);
        };

        $scope.edit = function(data) {

            userValue.set(data);
            $state.go('user-info');
        };

        $scope.search = function(filter) {
            users.getList(filter,
                function(users){
                    $scope.users = users;
                    $scope.noResults = false;
                },
                function(){
                    $scope.users = [];
                    $scope.noResults = true;
                }
            );
        };
    }
]);

