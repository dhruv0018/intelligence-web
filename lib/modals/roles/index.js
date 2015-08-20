/* Component resources */
const template    = require('./template.html');
const templateUrl = 'roles.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Roles page module.
 * @module Roles
 */
const Roles = angular.module('Roles', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Roles.run([
    '$templateCache',
    function run ($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Roles modal dialog service.
 * @module Roles
 * @name RolesModal
 * @type {Service}
 */
Roles.service('RolesModal', [
    '$modal',
    function service (
        $modal
    ) {

        return {

            open: () => {

                return $modal.open({

                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'roles.html',
                    controller: 'RolesController'
                }).result;
            }
        };
    }
]);

/**
 * Roles controller.
 * @module Roles
 * @name RolesController
 * @type {Controller}
 */
Roles.controller('RolesController', [
    '$scope',
    '$modalInstance',
    'SessionService',
    'AccountService',
    function controller (
        $scope,
        $modalInstance,
        session,
        account
    ) {

        $scope.session = session;
        $scope.roles   = session.currentUser.roles;

        $scope.setDefaultRole = function (role) {

            session.currentUser.setDefaultRole(role);
            session.storeCurrentUser();
            session.currentUser.save();
            $modalInstance.close();
            account.gotoUsersHomeState();
        };
    }
]);
