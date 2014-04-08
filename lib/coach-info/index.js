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
Athlete.directive('krossoverCoachInfo', [
    function directive() {

        var coach = {

            restrict: TO += ELEMENTS,
            templateUrl: 'coach-info.html',
            replace: true,
            link: function (scope, element, attributes) {

            }
        };

        return coach;
    }
]);
