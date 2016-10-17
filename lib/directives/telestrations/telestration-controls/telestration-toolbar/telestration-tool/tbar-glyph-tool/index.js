const angular = window.angular;

const TBarGlyphTool = angular.module('TBarGlyphTool', []);

TBarGlyphTool.directive('tbarGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/tbar-glyph-tool/template.html',
            scope: true,
            controller: ['$scope', function tBarGlyphToolController($scope) {

                $scope.toolType = TELESTRATION_TYPES.T_BAR_SOLID;
            }]
        };
    }
]);

export default TBarGlyphTool;
