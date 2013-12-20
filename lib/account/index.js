/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Account page module.
 * @module Account
 */
var Account = angular.module('account', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Account.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('account.html', require('./template.html'));
        $templateCache.put('contact-info.html', require('./contact-info.html'));
        $templateCache.put('roles-list.html', require('./roles-list.html'));
    }
]);

/**
 * Account page state router.
 * @module Account
 * @type {UI-Router}
 */
Account.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('account', {
                url: '/account',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'account.html',
                        controller: 'AccountController'
                    }
                }
            })

            .state('contact-info', {
                url: '',
                parent: 'account',
                views: {
                    'content@account': {
                        templateUrl: 'contact-info.html',
                        controller: 'AccountController'
                    }
                }
            })

            .state('roles-list', {
                url: '',
                parent: 'account',
                views: {
                    'content@account': {
                        templateUrl: 'roles-list.html',
                        controller: 'AccountController'
                    }
                }
            });
    }
]);

/**
 * Account controller.
 * @module Account
 * @name AccountController
 * @type {Controller}
 */
Account.controller('AccountController', [
    '$scope', 'SessionService', 'ROLES', 'ROLE_ID',
    function controller($scope, session, ROLES, ROLE_ID) {

        $scope.roleGroups = [];
        var i = 1;
        var roleFilter = function (role, j, roles) {
            return parseInt(role.type.id, 10) === i;
        };
        for (i = 1; i <= Object.keys(ROLE_ID).length; i += 1) {
            var roleName = ROLES[ROLE_ID[i]].type.name;
            var userRoles = session.currentUser.roles.filter(roleFilter);
            var roleGroup = {
                roleName: roleName,
                userRoles: userRoles
            };
            if (userRoles.length > 0) {
                $scope.roleGroups.push(roleGroup);
            }
        }

        $scope.COACH = ROLES.COACH;
        $scope.PARENT = ROLES.PARENT;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.INDEXER = ROLES.INDEXER;

        $scope.currentUser = session.currentUser;

        $scope.addAthleteRole = function() {

            $scope.currentUser.addRole(ROLES.ATHLETE);
            session.storeCurrentUser($scope.currentUser);
        };
    }
]);

