/* Component dependencies */
require('gap');
require('text');
require('yard');
require('static');
require('dropdown');
require('formation');
require('passing-zone');
require('team-dropdown');
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
    'Item.Gap',
    'Item.Text',
    'Item.Yard',
    'Item.Static',
    'Item.Dropdown',
    'Item.Formation',
    'Item.PassingZone',
    'Item.TeamDropdown',
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

                $scope.event.variableValues[$scope.item.index] = $scope.event.variableValues[$scope.item.index] || {};
                $scope.event.variableValues[$scope.item.index].id = $scope.event.variableValues[$scope.item.index].id || $scope.item.id;
                $scope.event.variableValues[$scope.item.index].type = null;
                $scope.event.variableValues[$scope.item.index].index = $scope.event.variableValues[$scope.item.index].index || $scope.item.index;
                $scope.event.variableValues[$scope.item.index].value = $scope.event.variableValues[$scope.item.index].value || null;
            }

            $scope.isString = function(item) {

                return angular.isString(item);
            };
        }

        return Item;
    }
]);

