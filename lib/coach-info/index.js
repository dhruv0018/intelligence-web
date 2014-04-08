/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * CoachInfo
 * @module CoachInfo
 */
var CoachInfo = angular.module('coach-info', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
CoachInfo.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach-info.html', require('./template.html'));
    }
]);

/**
 * CoachInfo directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
CoachInfo.directive('krossoverHeadCoachInfo', [
    'UsersFactory',
    function directive(users) {

        var coach = {

            restrict: TO += ELEMENTS,
            templateUrl: 'coach-info.html',
            scope: {
                team: '='
            },
            replace: true,
            link: function (scope, element, attributes) {


                scope.$watch('team', function () {
                    if (typeof scope.team !== 'undefined') {
                        var coachRole = scope.team.getHeadCoachRole();

                        scope.userRoles = [];

                        users.get(coachRole.userId, function (user) {
                            scope.coach = user;

                            //finds all roles that are associated with that user for that team
                            angular.forEach(user.roles, function (role) {
                                if (role.teamId === scope.team.id) {
                                    scope.userRoles.push(role.type.name);
                                }
                            });

                        });

                    }
                });


            }
        };

        return coach;
    }
]);
