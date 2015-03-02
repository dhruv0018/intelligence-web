
/* Fetch angular from the browser scope */
var angular = window.angular;

var Telestrations = angular.module('Telestrations');

// Directives
Telestrations.directive('glyph', require('./directive'));
