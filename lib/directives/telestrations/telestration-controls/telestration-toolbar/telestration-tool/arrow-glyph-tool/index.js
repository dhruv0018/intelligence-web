const angular = window.angular;

const ArrowGlyphTool = angular.module('ArrowGlyphTool', []);

ArrowGlyphTool.directive('arrowGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/arrow-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function arrowGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.ARROW_SOLID;
            }]
        };
    }
]);

export default ArrowGlyphTool;
