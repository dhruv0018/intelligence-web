
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('color-picker-template.html', require('./template.html'));
    }
]);

// Directives
Telestrations.directive('colorPickerTool', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'color-picker-template.html'
        };
    }
]);

// function colorSelection() {
//                     scope.dropdownState = scope.color;
//                     telestrationsController.selectedGlyphColor = scope.dropdownState;
//                 }

//                 elem.on('click', function($event) {
//                     if (scope.type) clickHandler = glyphSelection;
//                     if (scope.color) clickHandler = colorSelection;
//                     clickHandler();
//                     scope.$apply();
//                 });
