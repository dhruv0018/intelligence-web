/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/yard.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Yard
 * @module Yard
 */
var Yard = angular.module('Item.Yard', []);

/* Cache the template file */
Yard.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Yard directive.
 * @module Yard
 * @name Yard
 * @type {Directive}
 */
Yard.directive('krossoverItemYard', [
    function directive() {

        var Yard = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl
        };

        return Yard;
    }
]);
