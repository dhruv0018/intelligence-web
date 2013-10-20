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
 * Roles state router.
 * @module Roles
 * @type {UI-Router}
 */
Roles.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('roles', {

                onEnter: [ 'RolesModal', function(RolesModal) {} ]

            });
    }
]);

/**
 * Roles modal dialog service.
 * @module Roles
 * @name RolesModal
 * @type {Service}
 */
Roles.service('RolesModal', [
    '$rootScope', '$state', '$modal',
    function service($rootScope, $state, $modal) {

        return $modal.open({

            templateUrl: 'roles.html',
            controller: 'RolesController'

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
    '$rootScope', '$scope', '$state', '$modalInstance', 'Users',
    function controller($rootScope, $scope, $state, $modalInstance, users) {

        var user = $rootScope.currentUser;

        $scope.roles = user.roles;

        $scope.setDefaultRole = function(role) {

            user.setDefaultRole(role);
            $modalInstance.close();
            $state.go('account');
        };
    }
]);

