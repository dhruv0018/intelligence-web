/*globals require*/
require('./athlete');
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Roster
 * @module Athlete
 */
var Roster = angular.module('roster', [
    'ui.router',
    'ui.bootstrap',
    'athlete'
]);

/* Cache the template file */
Roster.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('roster.html', require('./template.html'));
    }
]);

/**
 * Roster directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Roster.directive('krossoverRoster', [
    function directive() {

        var roster = {

            restrict: TO += ELEMENTS,
            templateUrl: 'athlete.html',
            scope: {
                rosterId: '='
            },
            replace: true,
            link: function (scope, element, attributes) {

            }
        };

        return roster;
    }
]);
