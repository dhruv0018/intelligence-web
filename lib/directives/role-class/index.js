/* Constants */
var TO = '';
var ATTRIBUTE = 'A';

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
    'SessionService', 'ROLES',
    function directive(session, ROLES) {

        var roleClass = {

            restrict: TO += ATTRIBUTE,

            link: link
        };

        function link($scope, element, attrs) {

            var currentUser = session.currentUser;

            if (currentUser.is(ROLES.ATHLETE)) {
                element.addClass('athlete-role');
            }
        }

        return roleClass;
    }
]);
