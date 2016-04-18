/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'fancyToggle.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FancyToggle
 * @module FancyToggle
 */
var FancyToggle = angular.module('FancyToggle', []);

/* Cache the template file */
FancyToggle.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * fancyToggle directive.
 * @module FancyToggle
 * @name fancyToggle
 * @type {directive}
 */
FancyToggle.directive('fancyToggle', [
    function directive() {

        var FancyToggle = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl
        };

        return FancyToggle;
    }
]);
