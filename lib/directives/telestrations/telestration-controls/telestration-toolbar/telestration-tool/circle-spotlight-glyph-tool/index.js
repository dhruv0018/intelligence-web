const angular = window.angular;

const CircleSpotlightGlypehTool = angular.module('CircleSpotlightGlypehTool', []);

CircleSpotlightGlypehTool.directive('circleSpotlightGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/circle-spotlight-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function circleSpotlightGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.CIRCLE_SPOTLIGHT;
            }]
        };
    }
]);

export default CircleSpotlightGlypehTool;
