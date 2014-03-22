/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Item
 * @module Item
 */
var Item = angular.module('indexing.item', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Item.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/item.html', template);
    }
]);

/**
 * Item directive.
 * @module Item
 * @name Item
 * @type {Directive}
 */
Item.directive('item', [
    'IndexingService',
    function directive(indexing) {

        var Item = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '='
            },

            link: link,

            templateUrl: 'indexing/item.html',

        };

        function link($scope, element, attributes) {

            $scope.indexing = indexing;

            $scope.disabled = angular.isDefined(attributes.disabled);

            $scope.isString = function(item) {

                return angular.isString(item);
            };
        }

        return Item;
    }
]);

