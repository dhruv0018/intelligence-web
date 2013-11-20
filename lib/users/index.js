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
    'ui.bootstrap'
]);

/* Cache the template file */
Users.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('user.html', require('./user.html'));
        $templateCache.put('adduser.html', require('./adduser.html'));
        $templateCache.put('newrole.html', require('./newrole.html'));
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
                parent: 'base',
                views: {
                    'main@': {
                        templateUrl: 'users.html',
                        controller: 'UsersController'
                    }
                }
            })

            .state('user', {
                url: '/user/:id',
                parent: 'base',
                views: {
                    'main@': {
                        templateUrl: 'user.html',
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
    'ROLES', 'ROLE_TYPE', 'TeamsFactory',
    function directive(ROLES, ROLE_TYPE, teams) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {

                user: '=',
                role: '='
            },

            templateUrl: 'newrole.html',

            link: function($scope, element, attributes) {

                $scope.ROLE_TYPE = ROLE_TYPE;

                $scope.teams = teams.getAll();

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
    '$rootScope', '$scope', '$state', '$stateParams', 'SessionService', 'ROLES', 'UserValue', 'UsersFactory',
    function controller($rootScope, $scope, $state, $stateParams, session, ROLES, user, users) {

        /* Setup $scope. */

        $scope.ROLES = ROLES;
        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.users = users;

        $scope.currentUser = session.currentUser;

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

            setScopeUser(user.data);
        }


        /* Setup watches. */


        $scope.$watch('user.roles', function(roles) {

            $scope.disableSave = !roles || roles.length < 1;

        }, true);


        $scope.save = function(user) {

            users.save(user);

            $state.go('users');
        };

        $scope.cancel = function() {

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
    '$rootScope', '$scope', '$state', '$modal', 'ROLES', 'UserValue', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, ROLES, user, users) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;

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

