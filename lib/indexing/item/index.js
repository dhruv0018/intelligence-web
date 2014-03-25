/* Component dependencies */
require('static');
require('text');
require('dropdown');
require('player-dropdown');

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
var Item = angular.module('Indexing.Item', [
    'ui.router',
    'ui.bootstrap',
    'Indexing.Item.Static',
    'Indexing.Item.Text',
    'Indexing.Item.Dropdown',
    'Indexing.Item.PlayerDropdown'
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
                event: '=',
                disabled: '@'
            },

            link: link,

            templateUrl: 'indexing/item.html',

        };

        function link($scope, element, attributes) {

            $scope.indexing = indexing;

            $scope.isString = function(item) {

                return angular.isString(item);
            };
        }

        return Item;
    }
]);

