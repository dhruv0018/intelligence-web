
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// require sub-directives
require('arrow-glyph-tool');
require('circle-glyph-tool');
require('color-picker-tool');
require('freehand-glyph-tool');
require('tbar-glyph-tool');
require('undo-tool');

Telestrations.directive('telestrationTool', [
    function() {
        return {
            restrict: 'E',
            require: '^telestrations',
            scope: true,
            controller: [
                '$scope', '$element',
                function toolController($scope, $element) {

                    var self = this;

                    var telestrationsController = $element.inheritedData('$telestrationsController');

                    self.selectGlyphTool = function selectGlyphTool(glyphType) {

                        // TODO: fix since angular converts it to a string
                        var toolType = Number.parseInt(glyphType, 10);

                        telestrationsController.selectedGlyphType = toolType;
                    };
                }
            ]
        };
    }
]);
