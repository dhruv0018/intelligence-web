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

            $scope.$watch(
                function currentRole() {

                    var currentUser = session.currentUser;

                    if (currentUser && currentUser.currentRole) {
                        return currentUser.currentRole;
                    }
                },
                function listener() {

                    var currentUser = session.currentUser;
                    var role = currentUser.currentRole.type.name;
                    var selector = role.replace(/\s/, '-').toLowerCase() + '-role';

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
            );
        }

        return roleClass;
    }
]);
