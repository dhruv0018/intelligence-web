/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

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
                event: '=',
                autoAdvance: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.variable = {};

            Mousetrap.bind('enter', function() {

                $scope.$apply(function() {

                    if ($scope.event.activeEventVariableIndex == $scope.item.index) {

                        $scope.event.variableValues[$scope.item.index].value = $scope.variable.value;
                        $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                    }
                });

                return false;
            });

            element.on('$destroy', function() {

                Mousetrap.unbind('enter');
            });
        }

        return Text;
    }
]);

