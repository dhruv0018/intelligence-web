
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Shape
 * @module Shape
 */
var Shape = angular.module('Shape', []);

// Factories
Shape.factory('ShapeFactory', require('./shape'));
Shape.factory('SpotlightFactory', require('./spotlight'));
Shape.factory('ArrowFactory', require('./arrow'));
Shape.factory('ConeSpotlightFactory', require('./cone-spotlight'));
Shape.factory('CircleFactory', require('./circle'));
Shape.factory('FreehandFactory', require('./freehand'));
Shape.factory('CircleSpotlightFactory', require('./circle-spotlight'));
Shape.factory('TBarFactory', require('./tbar'));
Shape.factory('TextBoxFactory', require('./textbox'));

// Constants
Shape.value('ShapeConstants', require('./constants'));
