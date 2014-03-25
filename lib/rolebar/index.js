/* Component resources */
var template = require('./template.html');

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

/* Cache the template file */
Rolebar.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('rolebar.html', template);
    }
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

            replace: true,

            templateUrl: 'rolebar.html',

            link: function($scope, element, attributes) {

                $scope.$watch(watchExpression, listener);
            }
        };

        var watchExpression = function() {

            if (session.currentUser && session.currentUser.currentRole) {

                return session.currentUser.currentRole;
            }
        };

        var listener = function(currentRole, lastRole, $scope) {

            $scope.roleClassName = 'x-krossover-unknown';

            if (currentRole && currentRole.type && currentRole.type.id) {

                var role = ROLE_ID[currentRole.type.id];

                if (role) {

                    role = role.replace(/_/, '-');
                    role = role.toLowerCase();

                    $scope.roleClassName = 'x-krossover-' + role;
                }
            }
        };

        return KrossoverRolebar;
    }
]);

