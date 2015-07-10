
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('tbar-glyph-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('tbarGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'tbar-glyph-tool-template.html',
            scope: true,
            controller: ['$scope', function tBarGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.T_BAR_SOLID;
            }]
        };
    }
]);
