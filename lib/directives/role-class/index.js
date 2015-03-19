/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RoleClass
 * @module RoleClass
 */
var RoleClass = angular.module('RoleClass', []);

/**
 * RoleClass Directive
 * @module RoleClass
 * @name RoleClass
 * @type {directive}
 */
RoleClass.directive('roleClass', [
    'SessionService', 'ROLES', 'AuthenticationService',
    function directive(session, ROLES, auth) {

        var roleClass = {

            restrict: TO += ATTRIBUTES,

            link: link
        };

        function link($scope, element, attrs) {

            function currentRole() {

                var currentUser = session.getCurrentUser();

                if (currentUser && session.getCurrentRole()) {
                    return session.getCurrentRole();
                }
            }

            function onCurrentRole(role) {

                var roleName = role.type.name;
                var selector = roleName.replace(/\s/, '-').toLowerCase() + '-role';

                /* Enumerations (reference user constants):
                 *
                 * .anonymous-role
                 * .super-admin-role
                 * .admin-role
                 * .indexer-role
                 * .coach-role
                 * .head-coach-role
                 * .assistant-coach-role
                 * .parent-role
                 * .athlete-role
                 */

                element.addClass(selector);
            }

            $scope.$watch(currentRole, onCurrentRole);
        }

        return roleClass;
    }
]);
