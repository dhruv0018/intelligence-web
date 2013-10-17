/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Roles page module.
 * @module Roles
 */
var Roles = angular.module('roles', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Roles.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('roles.html', template);
    }
]);

/**
 * Roles page state router.
 * @module Roles
 * @type {UI-Router}
 */
Roles.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('roles', {
                'public': false,
                'url': '/roles',
                'views': {
                    'header': {
                        'templateUrl': 'header.html',
                        'controller': 'HeaderController'
                    },
                    'main': {
                        'templateUrl': 'roles.html',
                        'controller': 'RolesController'
                    }
                }
            });
    }
]);

/**
 * Roles controller.
 * @module Roles
 * @name RolesController
 * @type {Controller}
 */
Roles.controller('RolesController', [
    '$rootScope', '$scope', '$state', 'Users',
    function controller($rootScope, $scope, $state, users) {

        var user = $rootScope.currentUser;

        $scope.roles = user.roles;

        $scope.setDefaultRole = function(role) {

            user.setDefaultRole(role);
            $state.go('account');
        };
    }
]);

