/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/text.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Text
 * @module Text
 */
var Text = angular.module('Item.Text', []);

/* Cache the template file */
Text.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Text directive.
 * @module Text
 * @name Text
 * @type {Directive}
 */
Text.directive('krossoverItemText', [
    function directive() {

        var Text = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Text;
    }
]);

