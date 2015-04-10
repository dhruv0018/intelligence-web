/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/formation.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Formation
 * @module Formation
 */
var Formation = angular.module('Item.Formation', []);

/* Cache the template file */
Formation.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Formation directive.
 * @module Formation
 * @name Formation
 * @type {Directive}
 */
Formation.directive('krossoverItemFormation', [
    function directive() {

        var Formation = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl
        };

        return Formation;
    }
]);
