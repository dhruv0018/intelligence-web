/* Constants */
let TO = '';
const ELEMENTS = 'E';
/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template Constants */
const templateUrl = 'lib/directives/color-shape/template.html';

/**
 * color-shape
 * @module ColorShape
 */
let ColorShape = angular.module('ColorShape', []);

/**
 * colorShape directive.
 * @module ColorShape
 * @name colorShape
 * @type {Directive}
 */
ColorShape.directive('colorShape', colorShapeDirective);

function colorShapeDirective () {

    const colorShape = {

        restrict: TO += ELEMENTS,

        templateUrl: templateUrl,

        scope: {
            color: '='
        }
    };

    return colorShape;
}

export default ColorShape;
