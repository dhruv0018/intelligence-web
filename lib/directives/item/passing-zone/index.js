/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/passing-zone.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PassingZone
 * @module PassingZone
 */
var PassingZone = angular.module('Item.PassingZone', []);

/* Cache the template file */
PassingZone.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PassingZone directive.
 * @module PassingZone
 * @name PassingZone
 * @type {Directive}
 */
PassingZone.directive('krossoverItemPassingZone', [
    function directive() {

        var PassingZone = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl
        };

        return PassingZone;
    }
]);
