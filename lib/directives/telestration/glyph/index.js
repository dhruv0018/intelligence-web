
/* Fetch angular from the browser scope */
var angular = window.angular;

var Glyph = angular.module('Glyph', []);

// Directives
Glyph.directive('glyph', require('./directive'));
Glyph.directive('glyphEditor', require('./glyph-editor-directive'));
