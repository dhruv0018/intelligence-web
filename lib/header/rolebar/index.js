/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Rolebar
 * @module Rolebar
 */
var Rolebar = angular.module('rolebar', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Role class directive.
 * Adds a CSS class for the given role name.
 * @module Rolebar
 * @name RoleClass
 * @type {Directive}
 */
Rolebar.directive('krossoverRoleClass', [
    'ROLES',
    function directive(ROLES) {

        var KrossoverRoleClass = {

            restrict: TO += ATTRIBUTES,

            scope: {

                role: '='
            },

            link: function($scope, element, attributes) {

                $scope.$watch('role', function() {

                    if ($scope.role && $scope.role.type) {

                        Object.keys(ROLES).forEach(function(key) {

                            var role = ROLES[key];
                            var roleName = role.type.name.split(' ').join('-').toLowerCase();
                            var className = 'x-krossover-' + roleName;

                            if ($scope.role.type.id == role.type.id) {

                                element.addClass(className);

                            } else {

                                element.removeClass(className);
                            }
                        });
                    }
                });
            }
        };

        return KrossoverRoleClass;
    }
]);

/**
 * Rolebar directive.
 * @module Rolebar
 * @name Rolebar
 * @type {Directive}
 */
Rolebar.directive('krossoverRolebar', [
    'SessionService',
    function directive(session) {

        var KrossoverRolebar = {

            restrict: TO += ELEMENTS,

            template: '<div class="rolebar" x-krossover-role-class role="currentUser.currentRole"></div>',

            link: function($scope, element, attributes) {

                $scope.currentUser = session.currentUser;

                $scope.$watch('currentUser', function() {

                    $scope.currentUser = session.currentUser;
                });
            }
        };

        return KrossoverRolebar;
    }
]);

