/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/arena.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena
 * @module Arenas
 */
var Arena = angular.module('Item.Arena', []);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverItemArena', [
    function directive() {

        var Arena = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl
        };

        return Arena;
    }
]);
