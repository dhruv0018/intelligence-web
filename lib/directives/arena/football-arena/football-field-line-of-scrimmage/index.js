/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/football-arena/football-field-line-of-scrimmage/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldLineOfScrimmage
 * @module FootballFieldLineOfScrimmage
 */
var FootballFieldLineOfScrimmage = angular.module('Arena.Football.FootballFieldLineOfScrimmage', []);

/**
 * FootballFieldLineOfScrimmage directive.
 * @module FootballFieldLineOfScrimmage
 * @name FootballFieldLineOfScrimmage
 * @type {Directive}
 */
FootballFieldLineOfScrimmage.directive('krossoverArenaFootballFieldLineOfScrimmage', [
    function directive() {

        var FootballFieldLineOfScrimmage = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: true,
            templateUrl: templateUrl
        };

        return FootballFieldLineOfScrimmage;
    }
]);

export default FootballFieldLineOfScrimmage;
