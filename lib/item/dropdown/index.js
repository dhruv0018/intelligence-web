/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Dropdown
 * @module Dropdown
 */
var Dropdown = angular.module('Indexing.Item.Dropdown', []);

/* Cache the template file */
Dropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/item/dropdown.html', template);
    }
]);

/**
 * Dropdown directive.
 * @module Dropdown
 * @name Dropdown
 * @type {Directive}
 */
Dropdown.directive('dropdown', [
    'IndexingService',
    function directive(indexing) {

        var Dropdown = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '='
            },

            link: link,

            templateUrl: 'indexing/item/dropdown.html',

        };

        function link($scope, element, attributes) {

            $scope.indexing = indexing;
        }

        return Dropdown;
    }
]);

