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

/**
 * CoachInfo directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
CoachInfo.directive('krossoverHeadCoachInfo', [
    'UsersFactory', 'ROLES',
    function directive(users, roles) {

        var coach = {

            restrict: TO += ELEMENTS,
            templateUrl: 'lib/directives/coach-info/template.html',
            scope: {
                team: '='
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.roleName = roles.HEAD_COACH.type.name;
                var coachRole = {};

                scope.$watch('team', function() {
                    if (scope.team && typeof scope.team.getHeadCoachRole !== 'undefined') {

                        try {
                            coachRole = scope.team.getHeadCoachRole();

                            if (typeof coachRole === 'undefined') {
                                throw new window.Error('no head coach role');
                            }

                            users.get(coachRole.userId, function(user) {
                                scope.coach = user;
                            });

                        } catch (exception) {
                            console.log(exception.message);
                        }

                    }
                });


            }
        };

        return coach;
    }
]);

export default CoachInfo;
