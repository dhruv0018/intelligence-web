/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/football-field-block.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballFieldBlock
 * @module FootballFieldBlock
 */
var FootballFieldBlock = angular.module('Arena.Football.FootballFieldBlock', []);

/* Cache the template file */
FootballFieldBlock.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballFieldBlock directive.
 * @module FootballFieldBlock
 * @name FootballFieldBlock
 * @type {Directive}
 */
FootballFieldBlock.directive('krossoverArenaFootballFieldBlock', [
    function directive() {

        var FootballFieldBlock = {

            restrict: TO += ELEMENTS,
            require: '^krossoverArenaFootballField',
            scope: {
                block: '='
            },
            templateUrl: templateUrl
        };

        return FootballFieldBlock;
    }
]);

