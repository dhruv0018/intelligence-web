/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Static
 * @module Static
 */
var Static = angular.module('Indexing.Item.Static', []);

/* Cache the template file */
Static.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/item/static.html', template);
    }
]);

/**
 * Static directive.
 * @module Static
 * @name Static
 * @type {Directive}
 */
Static.directive('static', [
    function directive() {

        var Static = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '='
            },

            link: link,

            templateUrl: 'indexing/item/static.html',

        };

        function link($scope, element, attributes) {

        }

        return Static;
    }
]);

