
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('freehand-glyph-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('freehandGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'freehand-glyph-tool-template.html',
            scope: true,
            controller: ['$scope', function freeHandGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.FREEHAND_SOLID;
            }]
        };
    }
]);
