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
    '$parse', '$timeout',
    function directive($parse, $timeout) {

        var xyCoordinates = {

            restrict: TO += ELEMENTS,

            templateUrl: 'XYCoordinates.html',

            transclude: true,

            link: link
        };

        function link($scope, element, attributes) {

            const elementDOM = element[0];

            /* Variables for marking coordinates */

            const marker = elementDOM.getElementsByClassName('coordinate-marker')[0];
            const rootNode = element.children()[0];

            function getDimensions() {

                let elementRect = elementDOM.getBoundingClientRect();

                return {
                    width: elementRect.width,
                    height: elementRect.height
                };
            }

            /* Plots a coordinate marker relative to the dimensions of the element */

            function adjustMarkerPosition(relativeCoordinates) {

                if (relativeCoordinates) {

                    const absoluteCoordinates = relativeToAbsoluteCoordinates(relativeCoordinates);
                    marker.style.top = (absoluteCoordinates.y - 12) + 'px';
                    marker.style.left = (absoluteCoordinates.x - 11) + 'px';
                }
            }

            /* Data conversion methods */

            function absoluteToRelativeCoordinates(absoluteCoordinates) {

                let dimensions = getDimensions();

                return {
                    x: (absoluteCoordinates.x / dimensions.width),
                    y: (absoluteCoordinates.y / dimensions.height)
                };
            }

            function relativeToAbsoluteCoordinates(relativeCoordinates) {

                let dimensions = getDimensions();

                return {
                    x: (relativeCoordinates.x * dimensions.width),
                    y: (relativeCoordinates.y * dimensions.height)
                };
            }

            /* Click handler */

            $scope.onClick = onClick;

            function onClick(event) {

                const absoluteCoordinates = {
                    x: event.offsetX,
                    y: event.offsetY
                };

                const relativeCoordinates = absoluteToRelativeCoordinates(absoluteCoordinates);

                $scope.relativeCoordinates = relativeCoordinates;
            }

            /* Read in initial ngModel attribute value */

            const ngModel = $parse(attributes.ngModel);

            /* FIXME: Timeout to ensure the relativeCoordinates aren't
             * set before the element has had time to render to it's full height/width
             * xy-coordinates otherwise assumes that the height/width is ready
             * when it may not be for some elements that animations
             */
            const INITIAL_WAIT_TIME = 1000;

            $timeout(function setInitialRelativeCoordinates(){

                $scope.relativeCoordinates = $scope.$eval(attributes.ngModel);
            }, INITIAL_WAIT_TIME);

            /* One way data-binding (up): ng-model="relativeCoordinates" */

            $scope.$watchCollection('relativeCoordinates', onRelativeCoordinatesChange);

            function onRelativeCoordinatesChange(newRelativeCoordinates, previousRelativeCoordinates) {

                if (newRelativeCoordinates) {
                    ngModel.assign($scope, newRelativeCoordinates);
                    adjustMarkerPosition(newRelativeCoordinates);
                }
            }
        }

        return xyCoordinates;
    }
]);
