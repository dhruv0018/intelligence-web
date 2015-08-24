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
    '$parse', '$interval',
    function directive($parse, $interval) {

        var xyCoordinates = {

            restrict: TO += ELEMENTS,

            templateUrl: 'XYCoordinates.html',

            transclude: true,

            link: link
        };

        function link($scope, element, attributes) {

            const elementDOM = element[0];

            /* Read in initial ngModel attribute value */

            const ngModel = $parse(attributes.ngModel);


            function getDimensions() {

                let elementRect = elementDOM.getBoundingClientRect();

                return {
                    width: elementRect.width,
                    height: elementRect.height
                };
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

            function setCoordinateMarkerDisplay(absoluteCoordinates) {

                $scope.xyCoordinateMarkerStyle = {
                    left: absoluteCoordinates.x + 'px',
                    top: absoluteCoordinates.y + 'px'
                };

            }

            /* Click handler */

            $scope.onClick = onClick;

            function onClick(event) {

                const absoluteCoordinates = {
                    x: event.offsetX,
                    y: event.offsetY
                };

                // update display
                setCoordinateMarkerDisplay(absoluteCoordinates);

                // save model
                const relativeCoordinates = absoluteToRelativeCoordinates(absoluteCoordinates);
                ngModel.assign($scope, relativeCoordinates);
            }

            function setInitialRelativeCoordinates(){

                const relativeCoordinates = $scope.$eval(attributes.ngModel);
                const absoluteCoordinates = relativeToAbsoluteCoordinates(relativeCoordinates);
                setCoordinateMarkerDisplay(absoluteCoordinates);
            }

            const relativeCoordinates = $scope.$eval(attributes.ngModel);

            if (relativeCoordinates.x && relativeCoordinates.y) {

                /* FIXME: Interval to ensure the relativeCoordinates aren't
                 * set before the element has had time to render to it's full height/width
                 * xy-coordinates otherwise assumes that the height/width is ready
                 * when it may not be for some elements that have animations.
                 * Maxes out at 25 intervals
                 */
                const POLLING_INTERVAL_TIME = 100;
                const MAX_INTERVALS = 25;

                const intervalId = $interval(function waitForDimensions() {

                    const dimensions = getDimensions();

                    if (dimensions.height !== 0 && dimensions.width !== 0) {

                        setInitialRelativeCoordinates();
                    }
                }, POLLING_INTERVAL_TIME, MAX_INTERVALS);
            }

        }

        return xyCoordinates;
    }
]);
