/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/static.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Static
 * @module Static
 */
var Static = angular.module('Item.Static', []);

/* Cache the template file */
Static.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Static directive.
 * @module Static
 * @name Static
 * @type {Directive}
 */
Static.directive('krossoverItemStatic', [
    function directive() {

        var Static = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Static;
    }
]);

