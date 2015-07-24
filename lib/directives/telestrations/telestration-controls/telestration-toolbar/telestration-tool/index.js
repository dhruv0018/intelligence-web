
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// require sub-directives
require('arrow-glyph-tool');
require('circle-glyph-tool');
require('circle-spotlight-glyph-tool');
require('color-picker-tool');
require('cone-spotlight-glyph-tool');
require('freehand-glyph-tool');
require('tbar-glyph-tool');
require('text-glyph-tool');
// require('color-picker-tool');
require('undo-tool');

Telestrations.directive('telestrationTool', [
    function() {
        return {
            restrict: 'EA',
            require: '^telestrations',
            scope: true,
            controllerAs: 'telestrationTool',
            controller: [
                '$scope', '$element',
                function toolController($scope, $element) {

                    var self = this;

                    var telestrationsController = $element.inheritedData('$telestrationsController');

                    self.select = function select(glyphType) {

                        telestrationsController.selectedGlyphType = glyphType;
                        telestrationsController.toolToggled(glyphType);
                    };
                }
            ]
        };
    }
]);
