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
                coordinates: '=ngModel',
                arena: '='
            },

            link: link
        };

        function link($scope, element, attrs, controllers) {

            var marker = element[0].getElementsByClassName('coordinate-marker')[0];

            $scope.$watch('coordinates.xAbsolute', function() {

                if ($scope.coordinates) {
                    marker.style.left = ($scope.coordinates.xAbsolute - 8) + 'px';
                }
            });

            $scope.$watch('coordinates.yAbsolute', function() {

                if ($scope.coordinates) {
                    marker.style.top = ($scope.coordinates.yAbsolute - 8) + 'px';
                }
            });

            $scope.clickListener = function(event) {

                if (event) {

                    var rootNode = element.children()[0];
                    var dimensions = [rootNode.offsetWidth, rootNode.offsetHeight];
                    var coordinates = [event.offsetX, event.offsetY];
                    var ratio = [(coordinates[0] / dimensions[0]), (coordinates[1] / dimensions[1])];

                    $scope.coordinates = {
                        xRelative: ratio[0],
                        yRelative: ratio[1],
                        xAbsolute: coordinates[0],
                        yAbsolute: coordinates[1]
                    };

                } else {

                    throw new Error('Mouse event does not exist');

                }
            };
        }

        return xyCoordinates;
    }
]);
