const angular = window.angular;

const FreehandGlyphTool = angular.module('FreehandGlyphTool', []);

FreehandGlyphTool.directive('freehandGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/freehand-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function freeHandGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.FREEHAND_SOLID;
            }]
        };
    }
]);

export default FreehandGlyphTool;
