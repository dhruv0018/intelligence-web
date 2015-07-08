/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Dropdown
 * @module Dropdown
 */
var Dropdown = angular.module('Item.Dropdown', []);

/* Cache the template file */
Dropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Dropdown directive.
 * @module Dropdown
 * @name Dropdown
 * @type {Directive}
 */
Dropdown.directive('krossoverItemDropdown', [
    function directive() {

        var Dropdown = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl
        };

        return Dropdown;
    }
]);
