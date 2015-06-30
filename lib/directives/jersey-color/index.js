/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template Constants */
const templateUrl = 'jersey-color.html';
const template    = require('./template.html');

/**
 * jersey-color
 * @module JerseyColor
 */
let JerseyColor = angular.module('JerseyColor', []);

/* Cache the template file */
JerseyColor.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * jerseyColor directive.
 * @module JerseyColor
 * @name jerseyColor
 * @type {Directive}
 */
JerseyColor.directive('jerseyColor', jerseyColorDirective);

function jerseyColorDirective () {

    const jerseyColor = {

        restrict: TO += ELEMENTS,

        templateUrl: templateUrl,

        scope: {
            color: '='
        }
    };

    return jerseyColor;
}
