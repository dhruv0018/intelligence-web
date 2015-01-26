/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
* XYCoordinates
* @module XYCoordinates
*/
var XYCoordinates = angular.module('xy-coordinates', []);

/* Cache the template file */
XYCoordinates.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('XYCoordinates.html', template);
    }
]);

/**
* XYCoordinates directive.
* @module XYCoordinates
* @name XYCoordinates
* @type {Directive}
*/
XYCoordinates.directive('xyCoordinates', [

    function directive() {

        var xyCoordinates = {

            restrict: TO += ELEMENTS,

            templateUrl: 'XYCoordinates.html',

            scope: {
                variableValue: '=ngModel'
            },

            transclude: true,

            link: link
        };

        function link($scope, element, attrs, controllers) {

            var marker = element[0].getElementsByClassName('coordinate-marker')[0];

            $scope.$watch('coordinates.x', function watchX() {

                if ($scope.coordinates) {
                    marker.style.left = ($scope.coordinates.x - 11) + 'px';
                }
            });

            $scope.$watch('coordinates.y', function watchY() {

                if ($scope.coordinates) {
                    marker.style.top = ($scope.coordinates.y - 12) + 'px';
                }
            });

            $scope.clickListener = function clickListener(event) {

                if (event) {

                    var rootNode = element.children()[0];
                    var dimensions = [rootNode.offsetWidth, rootNode.offsetHeight];
                    var coordinates = [event.offsetX, event.offsetY];
                    var ratio = [(coordinates[0] / dimensions[0]), (coordinates[1] / dimensions[1])];

                    $scope.coordinates = {
                        x: coordinates[0],
                        y: coordinates[1]
                    };

                    $scope.variableValue = {
                        x: ratio[0],
                        y: ratio[1]
                    };

                } else {

                    throw new Error('Mouse event does not exist');

                }
            };
        }

        return xyCoordinates;
    }
]);
