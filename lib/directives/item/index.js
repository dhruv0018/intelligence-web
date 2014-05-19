/* Component dependencies */
require('static');
require('text');
require('dropdown');
require('player-dropdown');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Item
 * @module Item
 */
var Item = angular.module('Item', [
    'ui.router',
    'ui.bootstrap',
    'Item.Static',
    'Item.Text',
    'Item.Dropdown',
    'Item.PlayerDropdown'
]);

/* Cache the template file */
Item.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Item directive.
 * @module Item
 * @name Item
 * @type {Directive}
 */
Item.directive('krossoverItem', [
    '$location', '$anchorScroll', 'IndexingService',
    function directive($location, $anchorScroll, indexing) {

        var Item = {

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

            $scope.indexing = indexing;


            if ($scope.item && $scope.item.id && $scope.event && $scope.event.variableValues) {
                $scope.event.variableValues[$scope.item.id] = $scope.event.variableValues[$scope.item.id] || {};
            }

            $scope.isString = function(item) {

                return angular.isString(item);
            };
        }

        return Item;
    }
]);

