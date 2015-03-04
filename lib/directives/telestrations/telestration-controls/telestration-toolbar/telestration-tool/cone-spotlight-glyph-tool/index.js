
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('cone-spotlight-glyph-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('coneSpotlightGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'cone-spotlight-glyph-tool-template.html',
            scope: true,
            controller: ['$scope', function coneSpotlightGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.CONE_SPOTLIGHT;
            }]
        };
    }
]);
