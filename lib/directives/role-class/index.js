/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;
import RoleClassController from './controller';

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
    function directive() {

        var roleClass = {

            restrict: TO += ATTRIBUTES,

            link: link,

            controller: RoleClassController,
        };

        function link($scope, element, attributes, controller) {

            function onCurrentRole(newRole, oldRole) {

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

                if (oldRole) {
                    let oldClassName = controller.formatClassName(oldRole.type.name);
                    element.removeClass(oldClassName);
                }

                if (newRole) {
                    let newClassName = controller.formatClassName(newRole.type.name);
                    element.addClass(newClassName);
                }
            }

            $scope.$watch('session.getCurrentRole()', onCurrentRole);
        }

        return roleClass;
    }
]);
