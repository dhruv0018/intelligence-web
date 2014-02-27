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
 * Rolebar directive.
 * @module Rolebar
 * @name Rolebar
 * @type {Directive}
 */
Rolebar.directive('krossoverRolebar', [
    'ROLE_ID', 'SessionService',
    function directive(ROLE_ID, session) {

        var KrossoverRolebar = {

            restrict: TO += ELEMENTS,

            template: '<div class="rolebar" data-ng-class="roleClassName"></div>',

            link: function($scope, element, attributes) {

                $scope.currentUser = session.currentUser;

                $scope.$watch('currentUser.currentRole', function() {

                    var role = ROLE_ID[$scope.currentUser.currentRole.type.id];
                    role = role.replace(/_/, '-');
                    role = role.toLowerCase();

                    $scope.roleClassName = 'x-krossover-' + role;
                });
            }
        };

        return KrossoverRolebar;
    }
]);

