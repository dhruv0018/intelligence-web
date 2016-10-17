const angular = window.angular;

const TextGlyphTool = angular.module('TextGlyphTool', []);

TextGlyphTool.directive('textGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/text-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function textGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.TEXT;
            }]
        };
    }
]);

export default TextGlyphTool;
