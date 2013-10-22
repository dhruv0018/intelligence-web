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
 * Role type constant.
 * @module Role
 * @name ROLE_TYPE
 * @type {Constant}
 * @constant
 */
Role.constant('ROLE_TYPE', {

    SUPER_ADMIN: 1,
    ADMIN: 2,
    COACH: 3,
    ASSISTANT_COACH: 4
});

/**
 * Role directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Role.directive('krossoverRole', [
    'ROLE_TYPE', 'User',
    function directive(ROLE_TYPE, user) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: { role: '=' },

            templateUrl: 'role.html',

            link: function($scope, element, attributes) {

                if ($scope.role) {

                    var roleType = $scope.role.type.id;

                    /* For coaches, use "Coach [lastName] for the role title. */
                    if (roleType == ROLE_TYPE.COACH || roleType == ROLE_TYPE.ASSISTANT_COACH)
                        $scope.roleTitle = 'Coach ' + user.lastName;
                    else
                        $scope.roleTitle = user.name;

                    /* TODO: Pull in team info for the coaches role name */

                    /* For coaches, show their team name for the role name. */
                    if (roleType == ROLE_TYPE.COACH || roleType == ROLE_TYPE.ASSISTANT_COACH)
                        $scope.roleName = 'Team Needs to be Implemented';
                    else
                        $scope.roleName = $scope.role.type.name;
                }
            }
        };

        return role;
    }
]);

