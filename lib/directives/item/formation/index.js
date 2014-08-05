/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/formation.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Formation
 * @module Formation
 */
var Formation = angular.module('Item.Formation', []);

/* Cache the template file */
Formation.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Formation directive.
 * @module Formation
 * @name Formation
 * @type {Directive}
 */
Formation.directive('krossoverItemFormation', [
    function directive() {

        var Formation = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '=',
                autoAdvance: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.reset = function() {

                $scope.event.activeEventVariableIndex = $scope.item.index;
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
            };
        }

        return Formation;
    }
]);

