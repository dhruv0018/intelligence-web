/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Text
 * @module Text
 */
var Text = angular.module('indexing.item.text', []);

/* Cache the template file */
Text.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/item/text.html', template);
    }
]);

/**
 * Text directive.
 * @module Text
 * @name Text
 * @type {Directive}
 */
Text.directive('text', [
    function directive() {

        var Text = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '='
            },

            link: link,

            templateUrl: 'indexing/item/text.html',

        };

        function link($scope, element, attributes) {

        }

        return Text;
    }
]);

