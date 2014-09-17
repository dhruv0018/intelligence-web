/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Roles page module.
 * @module Roles
 */
var Roles = angular.module('Roles', [
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

                onEnter: [
                    'RolesModal',
                    function(RolesModal) {
                    }
                ]

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
    '$modal',
    function service($modal) {

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
    '$scope', '$state', '$modalInstance', 'SessionService', 'ROLES',
    function controller($scope, $state, $modalInstance, session, ROLES) {

        $scope.currentUser = session.currentUser;
        $scope.roles = session.currentUser.roles;

        $scope.setDefaultRole = function(role) {

            $scope.currentUser.setDefaultRole(role);
            session.storeCurrentUser($scope.currentUser);

            $modalInstance.close();

            /* If the current user is a super admin or an admin. */
            if (session.currentUser.is(ROLES.SUPER_ADMIN) || session.currentUser.is(ROLES.ADMIN)) {

                $state.go('users');
            }

            /* If the current user is an indexer. */
            else if (session.currentUser.is(ROLES.INDEXER)) {

                $state.go('indexer-games');
            }

            /* If the current user is a coach or an athlete. */
            else if (session.currentUser.is(ROLES.COACH) || session.currentUser.is(ROLES.ATHLETE)) {

                $state.go('Coach.FilmHome');
            }

            else {

                $state.go('Account.ContactInfo');
            }
        };
    }
]);

