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
                coordinates: '=ngModel'
            },

            link: link
        };

        function link($scope, element, attrs, controllers) {
            // console.log($scope.item.arena);

            // $scope.$watch('coordinates', function() {
            //     console.log('Directive', $scope.coordinates);
            // });

            var marker = document.getElementsByClassName('coordinate-marker')[0];

            $scope.$watch('coordinates.xAbs', function() {
                if ($scope.coordinates) {
                    marker.style.left = ($scope.coordinates.xAbs - 8) + 'px';
                    // console.log(marker);
                }
            });

            $scope.$watch('coordinates.yAbs', function() {
                if ($scope.coordinates) {
                    marker.style.top = ($scope.coordinates.yAbs - 8) + 'px';
                    // console.log(marker);
                }
            });

            $scope.clickListener = function(event) {

                if (event) {

                    var rootNode = element.children()[0];
                    var dimensions = [rootNode.offsetWidth, rootNode.offsetHeight];
                    var coordinates = [event.offsetX, event.offsetY];
                    var ratio = [(coordinates[0] / dimensions[0]), (coordinates[1] / dimensions[1])];

                    $scope.coordinates = {
                        x: ratio[0],
                        y: ratio[1],
                        xAbs: coordinates[0],
                        yAbs: coordinates[1]
                    };

                } else {

                    throw new Error('Mouse event does not exist');

                }
            };
        }

        return xyCoordinates;
    }
]);
