/* Component dependencies */
require('football-field-section');
require('football-field-line-of-scrimmage');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballField
 * @module FootballField
 */
var FootballField = angular.module('Arena.Football.FootballField', [
    'Arena.Football.FootballFieldSection',
    'Arena.Football.FootballFieldLineOfScrimmage'
]);

/* Cache the template file */
FootballField.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballField directive.
 * @module FootballField
 * @name FootballField
 * @type {Directive}
 */
FootballField.directive('krossoverArenaFootballField', [
    function directive() {

        var FootballField = {

            restrict: TO += ELEMENTS,
            scope: true,
            link: link,
            controller: 'Arena.Football.FootballField.controller',
            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return FootballField;
    }
]);


FootballField.controller('Arena.Football.FootballField.controller', [
    '$scope',
    function($scope) {

    }
]);

