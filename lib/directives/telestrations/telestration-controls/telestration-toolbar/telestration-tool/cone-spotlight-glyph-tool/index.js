const angular = window.angular;

const ConeSpotlightGlyphTool = angular.module('ConeSpotlightGlyphTool', []);

ConeSpotlightGlyphTool.directive('coneSpotlightGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/cone-spotlight-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function coneSpotlightGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.CONE_SPOTLIGHT;
            }]
        };
    }
]);

export default ConeSpotlightGlyphTool;
