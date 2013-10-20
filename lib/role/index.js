/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Role
 * @module Role
 */
var Role = angular.module('role', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Role.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('role.html', template);
    }
]);

/**
 * Role directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Role.directive('krossoverRole', [
    'Users',
    function directive(users) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: { role: '=' },

            templateUrl: 'role.html',

            link: function($scope, element, attributes) {

                if ($scope.role && $scope.role.userId) {

                    users.get({ id: $scope.role.userId }, function(user) {

                        $scope.user = user;
                    });
                }
            }
        };

        return role;
    }
]);

