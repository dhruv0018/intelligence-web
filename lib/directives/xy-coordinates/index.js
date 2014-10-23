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
var XYCoordinates = angular.module('XYCoordinates', []);

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

            },

            link: link
        };

        function link($scope, element, attrs, controllers) {
            $scope.registerClick = function(event) {
                if (event) {
                    console.log(event);
                }
            };
        }

        return xyCoordinates;

    }
]);
