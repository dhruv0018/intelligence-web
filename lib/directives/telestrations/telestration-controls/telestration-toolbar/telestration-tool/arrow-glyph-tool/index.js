
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('arrow-glyph-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('arrowGlyphTool', [
    'TELESTRATION_TYPES',
    function(TELESTRATION_TYPES) {
        return {
            restrict: 'E',
            templateUrl: 'arrow-glyph-tool-template.html',
            require: '^telestrationTool',
            scope: true,
            link: function arrowGlyphToolLink(scope, element, attribute, tool) {

                scope.toolType = TELESTRATION_TYPES.ARROW_SOLID;

                scope.selectTool = function selectTool() {

                    tool.selectGlyphTool(scope.toolType);
                };
            }
        };
    }
]);
