const angular = window.angular;

const CircleGlyphTool = angular.module('CircleGlyphTool', []);

CircleGlyphTool.directive('circleGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/circle-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function circleGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.CIRCLE_SOLID;
            }]
        };
    }
]);

export default CircleGlyphTool;
