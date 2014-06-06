/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-line-of-scrimmage.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldLineOfScrimmage
 * @module FootballFieldLineOfScrimmage
 */
var FootballFieldLineOfScrimmage = angular.module('Arena.Football.FootballFieldLineOfScrimmage', []);

/* Cache the template file */
FootballFieldLineOfScrimmage.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

