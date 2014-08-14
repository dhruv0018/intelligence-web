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
    '$location', '$anchorScroll',
    function directive($location, $anchorScroll) {

        var Item = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                game: '=',
                item: '=',
                play: '=',
                plays: '=',
                event: '=',
                league: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                autoAdvance: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            if ($scope.item && $scope.item.id && $scope.event && $scope.event.variableValues) {

                $scope.event.variableValues[$scope.item.id] = $scope.event.variableValues[$scope.item.id] || {};
                $scope.event.variableValues[$scope.item.id].type = null;

                if (!$scope.item.isRequired) {

                    $scope.event.variableValues[$scope.item.id].value = null;
                }
            }

            $scope.isString = function(item) {

                return angular.isString(item);
            };

            /* Watch for variable value changes. */
            $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                if (variableValue === previousVariableValue) return;

                if ($scope.autoAdvance) return;

                /* If the variable value has been set. */
                if (variableValue) {

                    /* If the play has been saved before. */
                    if ($scope.play.id) {

                        /* Save the play. */
                        $scope.play.save();
                    }
                }
            });
        }

        return Item;
    }
]);

