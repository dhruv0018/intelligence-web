
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('circle-glyph-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('circleGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'circle-glyph-tool-template.html',
            require: '^telestrationTool',
            scope: true,
            link: function circleGlyphToolLink(scope, element, attribute, tool) {

                scope.toolType = TELESTRATION_TYPES.CIRCLE_SOLID;
                scope.selectTool = tool.select;
            }
        };
    }
]);
