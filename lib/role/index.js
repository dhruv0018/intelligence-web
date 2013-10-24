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
    'SessionService', 'ROLE_TYPE',
    function directive(session, ROLE_TYPE) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: { role: '=' },

            templateUrl: 'role.html',

            link: function($scope, element, attributes) {

                $scope.$watch('role', function(role) {

                    if (role) {

                        var roleType = role.type.id;

                        /* TODO: Pull in team info for the coaches role name */

                        /* For coaches, use "Coach [lastName]" for the role title
                        /* and show their team name for the role name. */
                        if (roleType == ROLE_TYPE.COACH || roleType == ROLE_TYPE.ASSISTANT_COACH) {

                            $scope.roleTitle = 'Coach ' + session.currentUser.lastName;
                            $scope.roleName = 'Team Needs to be Implemented';

                        } else {

                            $scope.roleTitle = session.currentUser.firstName + ' ' + session.currentUser.lastName;
                            $scope.roleName = $scope.role.type.name;
                        }
                    }
                });
            }
        };

        return role;
    }
]);

