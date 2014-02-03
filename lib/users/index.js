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

Users.filter('EditableRolesByRole', [
    'ROLES', 'UsersFactory',
    function (ROLES, users) {

        return function(roles, role) {

            var filtered = [];

            if (!roles || !role) return filtered;

            angular.forEach(roles, function(filterRole) {

                /* Don't display group roles. */
                if (!Array.isArray(filterRole.type.id)) {

                    /* Add the role to the filtered list if the user has access. */
                    if (users.hasAccess(role, filterRole)) {

                        /* FIXME: Temporarily removing "Parent" role. */
                        if (!users.is(filterRole, ROLES.PARENT)) {

                            filtered.push(filterRole);
                        }
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
    'ROLES', 'ROLE_TYPE', 'UsersFactory', 'TeamsFactory', 'SportsResource', 'INDEXER_GROUPS_ID',
    function directive(ROLES, ROLE_TYPE, users, teams, sports, INDEXER_GROUPS_ID) {

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
                $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;

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
 * User controller. Controls the view for adding and editing a single user.
 * @module User
 * @name UserController
 * @type {Controller}
 */
Users.controller('UserController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', 'SessionService', 'AuthenticationService', 'AlertsService', 'ROLES', 'UsersFactory',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, session, auth, alerts, ROLES, users) {

        /* Setup $scope. */

        $scope.ROLES = ROLES;
        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.users = users;

        $scope.currentUser = session.currentUser;

        $scope.auth = auth;

        $scope.$storage = $localStorage;

        var user = $scope.$storage.user;
        var userId = $stateParams.id;

        if (!user || userId !== user.id) {

            users.get(userId, function(user) {

                $scope.$storage.user = user;

                /* If the user has roles, they already exist, so use a known role. */
                if ($scope.$storage.user.roles) {

                    /* Set the role to the users default role, or
                     * their first role if no default is set. */
                    $scope.role = $scope.$storage.user.getDefaultRole() ||
                                  $scope.$storage.user.roles[0] ||
                                  undefined;
                }
            });
        }

        $scope.$storage.user = $scope.$storage.user || {};
        $scope.$storage.user.newRoles = [];


        /* Setup watches. */


        $scope.$watch('$storage.user.isLocked', function(isLocked) {
            if (!isLocked) {

                alerts.clear();
            }

            else if ($scope.$storage.user.id && isLocked) {

                alerts.add({

                    type: 'danger',
                    message: 'This user is locked'
                });
            }
        });

        $scope.$watch('user.roles', function(roles) {

            $scope.disableSave = !roles || roles.length < 1;

        }, true);


        $scope.save = function(user) {

            /* Check if the modified user is the currently logged in user. */
            if (session.currentUser.id === user.id) {

                /* If so, update the current user. */
                session.storeCurrentUser(user);
            }

            users.save(user).then(function() {
                delete $scope.$storage.user;
                $state.go('users');
            });
        };

        $scope.addNewRole = function(newRole) {

            if (!newRole) return;

            $scope.$storage.user.roles = $scope.$storage.user.roles || [];

            /* In the case of an Admin role, there is no information to fill in,
             * so add the role directly. */
            if (users.is(newRole, ROLES.ADMIN)) {

                $scope.$storage.user.roles.unshift(angular.copy(newRole));

            /* For other roles; fill in information before adding. */
            } else {

                $scope.$storage.user.newRoles.unshift(angular.copy(newRole));
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
    '$rootScope', '$scope', '$state', '$modal', '$stateParams', '$localStorage', 'SessionService', 'ROLES', 'UsersFactory', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory',
    function controller($rootScope, $scope, $state, $modal, $stateParams, $localStorage, session, ROLES, users, teams, leagues, sports) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.$storage = $localStorage;
        $scope.currentUser = session.currentUser;
        $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Not Active'}];

        $scope.teams = [];
        $scope.leagues = [];
        $scope.sports = [];

        $scope.Users = users;

        $scope.users = users.getList();

        teams.getList({}, function(teams){

            teams.forEach(function(team){

                $scope.teams[team.id] = team;
            });
        });

        leagues.getList({}, function(leagues){

            leagues.forEach(function(league){

                $scope.leagues[league.id] = league;
            });
        });

        sports.getList({}, function(sports){

            sports.forEach(function(sport){

                $scope.sports[sport.id] = sport;
            });
        });

        $scope.add = function() {

            $modal.open({

                templateUrl: 'adduser.html'

            }).result.then(function(user) {

                $scope.$storage.user = user;
                $state.go('user-info');
            });
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
