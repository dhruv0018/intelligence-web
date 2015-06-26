
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('arrow-glyph-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('arrowGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'arrow-glyph-tool-template.html',
            scope: true,
            controller: ['$scope', function arrowGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.ARROW_SOLID;
            }]
        };
    }
]);
